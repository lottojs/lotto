import {
    Route,
    Handler,
    Method,
    Context,
    Path,
} from '@core/router/router.types'
import { buildRouteParameters, handlerUtils } from '@core/router/router.utils'
import { notFoundError } from '@core/router/router.errors'
import { bodyParser } from '@lottojs/body-parser'
import { paramsParser } from '@lottojs/params-parser'
import { cleanPath, isInstanceOf, isPath, toDebug } from '@core/utils/utils'
import { Router } from '@core/router/router'
import { cors } from '@lottojs/cors'
import { secureHeaders } from '@lottojs/secure-headers'
import { SecurityHeaders } from '@lottojs/secure-headers/lib/core/types'
import { CorsObject } from '@lottojs/cors/lib/core/types'
const debug = toDebug('router')

export class Routing {
    protected routes: Route[] = []
    protected prefix = '/'
    protected cors: CorsObject | undefined
    protected secureHeaders: SecurityHeaders | undefined

    /**
     * Find a route by path or/and method.
     * @param path Route path e.g. /products.
     * @param byRegex Search by regex method
     * @param method HTTP Method e.g. GET, PUT, POST...
     */
    protected match(
        path: Path,
        byRegex: boolean,
        method?: Method,
    ): Route | undefined {
        const isMatch = this.routes.find((route) => {
            if (route.method === method || !method) {
                if (byRegex) {
                    return (
                        route.method === method && route.regExpPath.test(path)
                    )
                }

                return route.method === method && route.path === path
            }
            return false
        })

        if (!path || method === 'MIDDLEWARE') {
            debug(`General middleware route${!isMatch ? ' not' : ''} found.`)
        } else {
            debug(`Route [${method}] - ${path}${!isMatch ? ' not' : ''} found.`)
        }

        return isMatch
    }

    /**
     * Register a route for the first time.
     * @param method HTTP Method e.g. GET, PUT, POST...
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when route is called.
     * @returns boolean
     */
    protected register(method: Method, path: Path, handler: Handler): boolean {
        path = cleanPath(`/${this.prefix}/${path}`)
        const regExpPath = buildRouteParameters(path as string)
        const matchsRoute = this.match(path, false, method)

        if (!matchsRoute) {
            this.routes.push({
                method,
                path,
                regExpPath,
                handler,
                middlewares: [],
            })

            if (method === 'ALL' && path.includes('*')) {
                debug('General middleware route, succesfully registered.')
            } else {
                debug(`Route [${method}] - ${path}, succesfully registered.`)
            }
        }

        return Boolean(matchsRoute)
    }

    /**
     * Register a middleware to a route.
     * @param path Route path e.g. /products.
     * @param middleware Middleware callback.
     * @param method HTTP Route method as GET, POST...
     */
    protected middleware(
        path: Path,
        middleware: Handler,
        method: Method,
    ): void {
        path = cleanPath(`/${this.prefix}/${path}`)
        const matchsRoute = this.match(path, path.includes('*'), method)
        if (matchsRoute) {
            matchsRoute.middlewares.push(middleware)

            if (path.includes('*')) {
                debug('General middleware registered.')
            } else {
                debug(
                    `Middleware added to route [${matchsRoute.method}] - ${path}.`,
                )
            }
        }
    }

    /**
     * Add a middleware to specific/all routes.
     * @param middleware Middleware callback.
     */
    public use(router: Router): this
    public use(handler: Handler): this
    public use(path: Path, router: Router): this
    public use(path: Path, handler: Handler): this
    public use(...input: unknown[]): this {
        if (input.length === 0) return this

        let path: Path | undefined

        if (isPath(input[0])) path = input.shift() as Path

        const mountPoint = path || this.prefix
        for (let i = 0; i < input.length; i++) {
            const item = input[i] as Router
            if (isInstanceOf(item, 'Router')) {
                const matchsRoute = this.match(mountPoint, false)
                if (!matchsRoute) {
                    item.routes.forEach((route) => {
                        this.register(
                            route.method,
                            `/${mountPoint}/${route.path}`,
                            route.handler,
                        )

                        route.middlewares.forEach((mid) => {
                            this.middleware(
                                `/${mountPoint}/${route.path}`,
                                mid,
                                route.method,
                            )
                        })
                    })
                }
                continue
            }

            if (typeof item === 'function') {
                const matchsRoute = this.match(mountPoint, false, 'ALL')
                if (!matchsRoute) this.register('ALL', '\\*', () => {})

                this.middleware('*', item as Handler, 'ALL')
            }
        }

        return this
    }

    /**
     * Serve a route with it's middlewares if present
     * @param method HTTP Method as GET, POST...
     * @param input
     * @returns this
     */
    protected serve(method: Method, ...input: any[]): this {
        if (input.length === 2 && typeof input[1] === 'function') {
            this.register(method, input[0], input[1])
        } else if (input.length === 2 && typeof input[2] === 'function') {
            this.register(method, input[0], input[2])
        } else if (
            input.length === 3 &&
            typeof input[1] === 'object' &&
            typeof input[2] === 'function'
        ) {
            const alreadyRegistered = this.register(method, input[0], input[2])

            if (!alreadyRegistered) {
                for (const mid of input[1]) {
                    this.middleware(input[0], mid, method)
                }
            }
        }

        return this
    }

    /**
     * Handles a route.
     * @param ctx Context Object
     */
    protected async handle(ctx: Context): Promise<void> {
        const { method, url } = ctx.req

        if (url === undefined) throw new Error('@lottojs/router: Invalid URL')

        // includes utils as json(), status() and so on...
        handlerUtils(ctx.req, ctx.res)

        const isPreflight = method === 'OPTIONS'

        if (isPreflight) {
            // cors middleware for preflight purpouses
            return cors(this.cors ?? {})(ctx)
        }

        const route = this.match(url, true, method as Method)
        if (route) {
            const allMiddlewares: Handler[] = []

            // general middlewares
            const rootRoute = this.match(`${this.prefix}/*`, true, 'ALL')
            if (rootRoute) {
                const { middlewares } = rootRoute

                middlewares.reverse()
                for await (const [idx, mid] of middlewares.entries()) {
                    allMiddlewares.unshift(mid)
                    debug(
                        `Adds general middleware [${idx}] to route [${route.method}] - ${route.path}.`,
                    )
                }
            }

            // route middlewares
            const { middlewares: routeMiddlewares, handler } = route
            for (const mid of routeMiddlewares) allMiddlewares.push(mid)

            let index = 0
            const middlewareWithParsedRequest: Handler[] = [
                // add security headers.
                secureHeaders(this.secureHeaders),
                // adds cors headers, methods etc.
                cors(this.cors ?? {}),
                // parse query and path parameters
                paramsParser(route.regExpPath.source),
            ]

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (['POST', 'PUT', 'PATCH'].includes(ctx.req.method!)) {
                // parse body
                middlewareWithParsedRequest.push(bodyParser())
            }

            // add middlewares
            middlewareWithParsedRequest.push(...allMiddlewares)

            const next = (error?: Error) => {
                if (index < middlewareWithParsedRequest.length) {
                    const idx = index++

                    const middleware = middlewareWithParsedRequest[idx]

                    debug(
                        `Calls middleware [${idx}] for route [${route.method}] - ${route.path}.`,
                    )

                    const regex =
                        /(?<!["'{}])\({[^{}]*\berror\b[^{}]*}\)(?![^{}]*})/g

                    const isErrorHandlingCustomMiddleware = regex.test(
                        middleware.toString(),
                    )

                    if (
                        (isErrorHandlingCustomMiddleware && error) ||
                        (!isErrorHandlingCustomMiddleware && !error)
                    ) {
                        middleware({
                            error,
                            next,
                            req: ctx.req,
                            res: ctx.res,
                        })
                    } else {
                        next(error)
                    }
                } else {
                    if (error) {
                        index = 0
                        next(error)
                    } else {
                        handler({ req: ctx.req, res: ctx.res, next })
                    }
                }
            }

            next()
        } else {
            notFoundError(ctx.res)
        }
    }
}
