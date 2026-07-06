import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import JwtService from '#services/jwt_service'
import User from '#models/user'

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      throw new Exception('Missing token', {
        status: 401,
        code: 'E_UNAUTHORIZED',
      })
    }

    const token = authHeader.replace('Bearer ', '')

    let payload: any

    try {
      payload = JwtService.verifyAccessToken(token)
    } catch {
      throw new Exception('Invalid or expired token', {
        status: 401,
        code: 'E_INVALID_TOKEN',
      })
    }

    const user = await User.find(payload.id)

    if (!user) {
      throw new Exception('User not found', {
        status: 401,
        code: 'E_USER_NOT_FOUND',
      })
    }

    // Attach user to HttpContext
    ctx.user = user

    await next()
  }
}