import type { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'

export default class RbacMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { roles: string[] }
  ) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Exception('Authorization token missing', {
        status: 401,
        code: 'E_UNAUTHORIZED',
      })
    }

    const token = authHeader.replace('Bearer ', '')

    let payload: any

    try {
      payload = jwt.verify(token, env.get('JWT_SECRET'))
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

    if (!options.roles.includes(user.role)) {
      throw new Exception('Access denied', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    /**
     * Attach authenticated user
     */

    ctx.user = user

    await next()
  }
}