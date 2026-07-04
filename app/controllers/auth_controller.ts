import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'
import { refreshValidator } from '#validators/refresh'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await AuthService.register(payload)

    return response.created({
      message: 'User registered successfully',
      data: user,
    })
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const result = await AuthService.login(
      payload,
      request.ip(),
      request.header('user-agent') ?? ''
    )

    return response.ok(result)
  }

  async refresh({ request, response }: HttpContext) {
    const payload = await request.validateUsing(refreshValidator)

    const tokens = await AuthService.refresh(
      payload.refreshToken,
      request.ip(),
      request.header('user-agent') ?? ''
    )

    return response.ok(tokens)
  }

  async logout({ request, response }: HttpContext) {
    const payload = await request.validateUsing(refreshValidator)

    await AuthService.logout(payload.refreshToken)

    return response.ok({
      message: 'Logged out successfully',
    })
  }
}
