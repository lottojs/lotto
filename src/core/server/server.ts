import http, {
    IncomingMessage,
    Server as HttpServer,
    ServerResponse,
} from 'node:http'
import {
    NextFunction as CallbackFunction,
    Handler,
    Request,
    Response,
} from '@core/router/router.types'
import { toDebug } from '@core/utils/utils'
const debug = toDebug('server')

export interface ServerOptions {
    /**
     * Server port. e.g. 9004
     */
    port?: number

    /**
     * Server host e.g. 0.0.0.0
     */
    host?: string
}

export interface AbstractServer {
    create: (handler: Handler) => void
    listen: (callback?: CallbackFunction) => void
}

export class Server implements AbstractServer {
    private server?: HttpServer
    private options: ServerOptions

    /**
     * Server configurations as port, host...
     */
    constructor({ port = 9004, host = '0.0.0.0' }: ServerOptions) {
        this.options = { port, host }
    }

    /**
     * Creates a HTTP server.
     * @param router Router Class
     */
    public create(handler: Handler) {
        this.server = http.createServer(
            async (req: IncomingMessage, res: ServerResponse) => {
                handler({
                    req: req as Request,
                    res: res as Response,
                    next: () => {},
                })
            },
        )
        debug('Creating HTTP server...')
    }

    /**
     * Listen for connections by default on port 9004.
     * @param callback Any callbacks to be executed after server start.
     */
    public listen(callback?: CallbackFunction): void {
        if (!this.server) {
            debug('Server not created.')
            throw Error('@lottojs/router: Needs to create a server first.')
        }

        const { host, port } = this.options
        this.server.listen({ path: '/api', port, host }, () => {
            debug(`Listening on port ${port}`)

            if (callback) {
                if (typeof callback === 'function') return callback()

                throw Error(
                    '@lottojs/router: Listen callback needs to be a function.',
                )
            }
        })
    }
}
