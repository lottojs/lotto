import { Response } from '@core/router/router.types'
import { toString, toDebug } from '@core/utils/utils'
const debug = toDebug('router:errors')

export function badRequestError(res: Response) {
    debug(`400 Bad Request [${res.req.method}] - ${res.req.url}`)
    res.status(400).json({
        message: `bad request.`,
    })
}

export function notFoundError(res: Response) {
    debug(`404 Not Found [${res.req.method}] - ${res.req.url}`)
    res.status(404).json({
        message: `route ${res.req.url} not found.`,
    })
}

export function internalError(res: Response, error: Error) {
    debug(`500 Internal Server Error [${res.req.method}] - ${res.req.url}`)
    res.status(500).json(
        error.message ||
            toString({
                message: 'Internal Server Error',
            }),
    )
}
