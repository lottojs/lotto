import Debug, { Debugger } from 'debug'
import { Path } from '@core/router/router.types'

/**
 * Show a debug line on console if DEBUG env is properly setted.
 * @param _module module name to be showed affter lottojs:
 * @returns Debbuger
 */
export function toDebug(_module: string): Debugger {
    return Debug(`lottojs:${_module.toLowerCase()}`)
}

/**
 * Verify if passed data is an object.
 * @param input object to be tested
 * @returns Boolean
 */
export function isObject(input: unknown): input is Record<string, unknown> {
    return (
        typeof input === 'object' &&
        input !== null &&
        !!input &&
        !Array.isArray(input)
    )
}

/**
 * Verify if the input is from type Router
 * @param input Any type of data
 * @param name Instance name
 * @returns boolean
 */
export function isInstanceOf(input: unknown, name: string) {
    if (!isObject(input) && typeof input !== 'function') {
        return false
    }

    return (
        (input as { '@instanceof': symbol })['@instanceof'] === Symbol.for(name)
    )
}

/**
 * Verify if the input is from type Path
 * @param input Any type of data
 * @returns boolean
 */
export function isPath(input: unknown): input is Path {
    return typeof input === 'string'
}

/**
 * Converts object or array to string.
 * @param object Object/Array to be converted.
 * @returns JSON.
 */
export function toString<T>(object: object | Array<T>): string {
    return JSON.stringify(object)
}

/**
 * Converts stringto JSON.
 * @param data String to be converted.
 * @returns
 */
export function toJson(data: string): JSON {
    return JSON.parse(data)
}

/**
 * Clean trailling and duplicate slashes from a path.
 * @param path url path e.g.: /users
 * @returns path as string
 */
export function cleanPath(path: Path): string {
    return path.replace(/\/{2,}/g, '/').replace(/^\/+/g, '/')
}
