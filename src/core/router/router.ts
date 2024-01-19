import { Handler, Method, Path } from '@core/router/router.types'
import { Routing } from '@core/router/routing'

interface AbstractRouter {
    /**
     * Define a route on ALL HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    all(path: Path, middlewares: Handler[], handler: Handler): this
    all(path: Path, handler: Handler): this
    all(path: Path, ...input: any[]): this

    /**
     * Define a route on GET HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    get(path: Path, middlewares: Handler[], handler: Handler): this
    get(path: Path, handler: Handler): this
    get(path: Path, ...input: any[]): this

    /**
     * Define a route on POST HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    post(path: Path, middlewares: Handler[], handler: Handler): this
    post(path: Path, handler: Handler): this
    post(path: Path, ...input: any[]): this

    /**
     * Define a route on PUT HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    put(path: Path, middlewares: Handler[], handler: Handler): this
    put(path: Path, handler: Handler): this
    put(path: Path, ...input: any[]): this

    /**
     * Define a route on PATCH HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    patch(path: Path, middlewares: Handler[], handler: Handler): this
    patch(path: Path, handler: Handler): this
    patch(path: Path, ...input: any[]): this

    /**
     * Define a route on DELETE HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    delete(path: Path, middlewares: Handler[], handler: Handler): this
    delete(path: Path, handler: Handler): this
    delete(path: Path, ...input: any[]): this

    /**
     * Define a route on OPTIONS HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    options(path: Path, middlewares: Handler[], handler: Handler): this
    options(path: Path, handler: Handler): this
    options(path: Path, ...input: any[]): this

    /**
     * Define a route on HEAD HTTP method.
     * @param path Route path e.g. /products.
     * @param handler Callback to be executed when the route is called.
     * @returns
     */
    head(path: Path, middlewares: Handler[], handler: Handler): this
    head(path: Path, handler: Handler): this
    head(path: Path, ...input: any[]): this
}

export interface Router extends AbstractRouter {}

export class Router extends Routing implements AbstractRouter {
    readonly '@instanceof' = Symbol.for('Router')

    constructor() {
        super()

        const httpMethods: Method[] = [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'OPTIONS',
            'HEAD',
            'ALL',
            'DELETE',
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
}
