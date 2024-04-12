import { IncomingMessage, ServerResponse } from 'node:http'

export type MultipartContent = {
    /**
     * Content field name.
     */
    name: string

    /**
     * Content file name.
     */
    fileName: string

    /**
     * Content type e.g.: image/svg+xml.
     */
    contentType: string

    /**
     * Content as a Buffer.
     */
    content: Buffer
}

export type Params = Record<string, any>
export type Query = undefined | string | string[]
export interface ParsedQuery {
    [key: string]: Query
}

export interface Request extends IncomingMessage {
    /**
     * Request body.
     */
    body: any

    /**
     * Retrieve specific file by field name.
     *
     * Examples:
     *
     *     res.file('document');
     * @param field field name
     * @returns MultipartContent | undefined
     */
    file: (field: string) => MultipartContent | undefined

    /**
     * Request files.
     */
    files: MultipartContent[] | null

    /**
     * Retrieve specific query parameter.
     *
     * Examples:
     *
     *     res.get('gclid');
     * @param query query parameter
     * @returns Query
     */
    get: (query: string) => Query

    /**
     * Retrieve specific path parameter.
     *
     * Examples:
     *
     *     res.param('id');
     * @param param path parameter
     * @returns T | undefined
     */
    param: <T = string>(param: string) => T | undefined

    /**
     * Request path parameters e.g.: /:id, /user/:id/:group.
     */
    params: Params

    /**
     * Request query parameters e.g.: ...?gclid=123
     */
    query: ParsedQuery
}
export interface Response<T = unknown> extends ServerResponse {
    /**
     * Send application/json response.
     *
     * Examples:
     *
     *     res.json(null);
     *     res.json({ fruit: 'apple' });
     *     res.status(200).json('oh we are here!');
     * @param body Data to be transformed on JSON.
     * @returns Response
     */
    json: (body?: unknown) => Response<T>

    /**
     * Set status `code`.
     * @param code HTTP status code e.g. 200, 201, 400, 404...
     * @returns Response
     */
    status: (code: number) => Response<T>

    /**
     * Send text/plain response.
     *
     * Examples:
     *
     *     res.text('hello world!');
     *     res.status(200).text('oh we are here!');
     * @param body Data to be transformed on text.
     * @returns Response
     */
    text: (body: unknown) => Response<T>
}

export type RegExpPath = RegExp
export type Path = string
export type Method =
    | 'MIDDLEWARE'
    | 'ALL'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'

export type NextFunction = (...args: any[]) => void
export type Context = {
    /**
     * Error Object
     */
    error?: any

    /**
     * Request Object
     */
    req: Request

    /**
     * Response Object
     */
    res: Response

    /**
     * Next Function, mostly used on middlewares in order to can go ahead
     * to the reqeuest.
     */
    next: NextFunction
}
export type Handler = (ctx: Context) => void

export type Middleware = {
    handler: Handler
    group: number
}

export type Route = {
    /**
     * Route HTTP Method e.g.: GET, POST...
     */
    method: Method

    /**
     * Route regex path.
     */
    regExpPath: RegExpPath

    /**
     * Route string path.
     */
    path: Path

    /**
     * Route final handler.
     */
    handler: Handler

    /**
     * Route middlewares.
     */
    middlewares: Middleware[]

    /**
     * Route group to be used on middlewares.
     */
    group: number
}
