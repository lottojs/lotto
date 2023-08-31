import {
    ErrorHandler,
    Route,
    Handler,
    Method,
    Middleware,
    Context,
    Path,
} from '@core/router/router.types'
import { buildRouteParameters, handlerUtils } from '@core/router/router.utils'
import { internalError, notFoundError } from '@core/router/router.errors'
import { bodyParser } from '@lottojs/body-parser'
import { paramsParser } from '@lottojs/params-parser'
import { cleanPath, isPath, isRouterInstance, toDebug } from '@core/utils/utils'
const debug = toDebug('router')

interface AbstractRouter {
    /**
     * Define a route on ALL HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    all(path: Path, middlewares: Middleware[], handler: Handler): void
    all(path: Path, handler: Handler): void
    all(path: Path, ...input: any[]): void

    /**
     * Define a route on GET HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    get(path: Path, middlewares: Middleware[], handler: Handler): void
    get(path: Path, handler: Handler): void
    get(path: Path, ...input: any[]): void

    /**
     * Define a route on POST HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    post(path: Path, middlewares: Middleware[], handler: Handler): void
    post(path: Path, handler: Handler): void
    post(path: Path, ...input: any[]): void

    /**
     * Define a route on PUT HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    put(path: Path, middlewares: Middleware[], handler: Handler): void
    put(path: Path, handler: Handler): void
    put(path: Path, ...input: any[]): void

    /**
     * Define a route on PATCH HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    patch(path: Path, middlewares: Middleware[], handler: Handler): void
    patch(path: Path, handler: Handler): void
    patch(path: Path, ...input: any[]): void

    /**
     * Define a route on DELETE HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    delete(path: Path, middlewares: Middleware[], handler: Handler): void
    delete(path: Path, handler: Handler): void
    delete(path: Path, ...input: any[]): void

    /**
     * Define a route on OPTIONS HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    options(path: Path, middlewares: Middleware[], handler: Handler): void
    options(path: Path, handler: Handler): void
    options(path: Path, ...input: any[]): void

    /**
     * Define a route on HEAD HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    head(path: Path, middlewares: Middleware[], handler: Handler): void
    head(path: Path, handler: Handler): void
    head(path: Path, ...input: any[]): void
}

export interface Router extends AbstractRouter {}

export class Router implements AbstractRouter {
    readonly '@instanceof' = Symbol.for('Router')
    private routes: Route[] = []
    protected prefix = '/'

    constructor() {
        const httpMethods: Method[] = [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'OPTIONS',
            'HEAD',
            'ALL',
        ]
        httpMethods.forEach((method) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[method.toLowerCase()] = (...input: any[]) => {
                this.serve(method, ...input)
                return this
            }
        })
    }

    /**
     * Server a route with it's middlewares if present
     * @param method HTTP Method as GET, POST...
     * @param input
     * @returns this
     */
    private serve(method: Method, ...input: any[]): this {
        if (input.length === 2 && typeof input[2] === 'function') {
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
     * Find a route by path or/and method.
     * @param path Route path e.g. /products.
     * @param byRegex Search by regex method
     * @param method HTTP Method e.g. GET, PUT, POST...
     */
    private match(
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
        middleware: Middleware,
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
    public use(handler: Middleware): this
    public use(handler: ErrorHandler): this
    public use(path: Path, router: Router): this
    public use(path: Path, handler: Middleware): this
    public use(path: Path, handler: ErrorHandler): this
    public use(...input: unknown[]): this {
        if (input.length === 0) return this

        let path: Path | undefined

        if (isPath(input[0])) path = input.shift() as Path

        const mountPoint = path || this.prefix
        for (let i = 0; i < input.length; i++) {
            const item = input[i]
            if (isRouterInstance(item)) {
                const matchsRoute = this.match(mountPoint, false)
                if (!matchsRoute) {
                    item.routes.forEach((route) => {
                        this.register(
                            route.method,
                            `/${mountPoint}/${route.path}`,
                            route.handler,
                        )
                    })
                }
                continue
            }

            if (typeof item === 'function') {
                const matchsRoute = this.match(mountPoint, false, 'ALL')
                if (!matchsRoute) this.register('ALL', '\\*', () => {})

                this.middleware('*', item as Middleware, 'ALL')
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

        const route = this.match(url, true, method as Method)
        if (route) {
            const allMiddlewares: Middleware[] = []

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
            const middlewareWithParsedRequest: any[] = [
                // parse query and path parameters
                paramsParser(route.regExpPath.source),
            ]

            if (['POST', 'PUT', 'PATCH'].includes(ctx.req.method!)) {
                // parse body
                middlewareWithParsedRequest.push(bodyParser())
            }

            // add middlewares
            middlewareWithParsedRequest.push(...allMiddlewares)

            const next = (error?: Error) => {
                if (error) return internalError(ctx.res, error)

                if (index < middlewareWithParsedRequest.length) {
                    const idx = index++
                    const middleware = middlewareWithParsedRequest[idx]

                    debug(
                        `Calls middleware [${idx}] for route [${route.method}] - ${route.path}.`,
                    )
                    middleware({ req: ctx.req, res: ctx.res, next })
                } else {
                    handler(ctx)
                }
            }

            next()
        } else {
            notFoundError(ctx.res)
        }
    }
}
