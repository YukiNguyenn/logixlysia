import Elysia from 'elysia'
import { formatLogger } from './logger'
import { startString } from './utils/start'
import { Server } from 'bun'

/**
 * Creates a logger.
 *
 * @export {Function} The logger.
 * @module logger
 * @category Logger
 * @subcategory Functions
 *
 * @name Logixlysia
 * @description Logixlysia is a logger plugin for ElysiaJS.
 * @author PunGrumpy
 * @license MIT
 *
 * @returns {Elysia} The logger.
 */
export const logger = (): Elysia => {
  const log = formatLogger()

  const elysia = new Elysia({
    name: 'Logixlysia'
  })
    .onStart(ctx => {
      startString(ctx.app.server as Server)
    })
    .onRequest(ctx => {
      ctx.store = { beforeTime: process.hrtime.bigint() } as {
        beforeTime: bigint
      }
    })
    .onBeforeHandle(ctx => {
      ctx.store = { beforeTime: process.hrtime.bigint() } as {
        beforeTime: bigint
      }
    })
    .onAfterHandle(({ request, store }) => {
      log.info(request, {}, store as { beforeTime: bigint })
    })
    .onError(({ request, error, store }) => {
      log.error(request, error, store as { beforeTime: bigint })
    })

  return elysia
}
