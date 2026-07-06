import type { HttpContext } from '@adonisjs/core/http'
import JwtService from '#services/jwt_service'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
// export default class AuthMiddleware {
//   async handle(
//     ctx: HttpContext,
//     next: NextFn,
//     options: {
//       guards?: (keyof Authenticators)[]
//     } = {}
//   ) {
//     await ctx.auth.authenticateUsing(options.guards)
//     return next()
//   }
// }

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return ctx.response.unauthorized({
        message: 'Missing token',
      })
    }

    const token = authHeader.replace('Bearer ', '')

    const payload = JwtService.verifyAccessToken(token)

    // ctx.auth.user is a readonly property on the AuthContract type.
    // Cast to any to allow assigning the verified JWT payload for downstream use.
    ;(ctx.auth as any).user = payload

    await next()
  }
}
