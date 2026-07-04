import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    const status = error.status || 500

    return ctx.response.status(status).send({
      success: false,
      status,
      message: app.inProduction
        ? 'Internal Server Error'
        : error.message,
      timestamp: new Date().toISOString(),
    })
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}