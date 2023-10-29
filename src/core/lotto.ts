import { Router } from '@core/router/router'
import { Server, ServerOptions } from '@core/server/server'

interface LottoOptions extends ServerOptions {
    /**
     * Api prefix e.g. /api/v1
     */
    prefix?: string
}

interface AbstractLotto {
    init: (after?: (...args: unknown[]) => void) => void
}

export class Lotto extends Router implements AbstractLotto {
    private server: Server

    /**
     * LottoJS HTTP Router
     * @param options Server options
     */
    constructor(options?: LottoOptions) {
        super()

        if (options?.prefix) this.prefix = options.prefix
        if (options?.cors) this.cors = options.cors
        this.server = new Server({
            ...(options?.host ? { host: options.host } : {}),
            ...(options?.port ? { port: options.port } : {}),
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
