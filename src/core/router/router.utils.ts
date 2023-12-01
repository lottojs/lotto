import {
    Context,
    MultipartContent,
    Query,
    Response,
} from '@core/router/router.types'
import { toString } from '@core/utils/utils'

/**
 * Provide utils for the context object.
 * @param req Request
 * @param res Response
 */
export function handlerUtils(req: Context['req'], res: Context['res']): void {
    res.json = function (body?: any): Response {
        res.setHeader('Content-Type', 'application/json')
        res.end(toString(body))

        return this
    }

    res.status = function (code: number): Response {
        res.statusCode = code

        return this
    }

    res.text = function (body?: unknown): Response {
        res.setHeader('Content-Type', 'text/plain')
        res.end(String(body))

        return this
    }

    req.file = function (field: string): MultipartContent | undefined {
        return req.files?.find((file) => file.name === field)
    }

    req.get = function (query: string): Query {
        return req.query[query]
    }

    req.param = function <T = string>(param: string): T | undefined {
        return req.params[param]
    }
}

/**
 * Build a regExp route path with `pathName` and `query` group.
 * @param path Route path e.g.: /users/:id
 * @returns
 */
export function buildRouteParameters(path: string) {
    const routeParamsRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(
        routeParamsRegex,
        '(?<$1>[a-zA-Z0-9-_]+)',
    )

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}
