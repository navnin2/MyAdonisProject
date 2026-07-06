import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class RbacMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { roles: string[] }
  ) {
    const user = ctx.user

    if (!user) {
      throw new Exception('Unauthorized', {
        status: 401,
        code: 'E_UNAUTHORIZED',
      })
    }

    if (!options.roles.includes(user.role)) {
      throw new Exception('Access denied', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    await next()
  }
}