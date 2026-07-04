import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const start = Date.now()

    await next()

    const time = Date.now() - start

    ctx.logger.info(
      `[${ctx.request.method()}] ${ctx.request.url()} ${ctx.response.getStatus()} ${time}ms`
    )
  }
}
