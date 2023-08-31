import { Router } from '@core/router/router'
import { Server, ServerOptions } from '@core/server/server'

interface LottoRouterOptions extends ServerOptions {
    /**
     * Api prefix e.g. /api/v1
     */
    prefix?: string
}

interface AbstractLottoRouter {
    init: (after?: (...args: unknown[]) => void) => void
}

export class LottoRouter extends Router implements AbstractLottoRouter {
    private server: Server

    /**
     * LottoJS HTTP Router
     * @param options Server options
     */
    constructor({ host, port, prefix = '/' }: LottoRouterOptions) {
        super()
        this.prefix = prefix
        this.server = new Server({
            host,
            port,
        })
    }

    /**
     * Listen for connections.
     * @param after Any callbacks to be executed after server start.
     */
    public init(after?: (...args: unknown[]) => void): void {
        this.server.create((ctx) => this.handle(ctx))
        this.server.listen(after)
    }
}
