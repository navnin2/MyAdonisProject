import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import JwtService from './jwt_service.ts'
import { randomUUID } from 'crypto'
import RefreshToken from '#models/refresh_token'
import db from '@adonisjs/lucid/services/db'

interface RegisterPayload {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'staff'
}

interface LoginPayload {
  email: string
  password: string
}

export default class AuthService {
  static async register(payload: RegisterPayload) {
    const existingUser = await User.findBy('email', payload.email)

    if (existingUser) {
      throw new Exception('Email already exists', {
        status: 409,
        code: 'E_EMAIL_ALREADY_EXISTS',
      })
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }
  }

  static async login(payload: LoginPayload, ipAddress: string, userAgent: string) {
    const user = await User.findBy('email', payload.email)

    if (!user) {
      throw new Exception('Invalid email or password', {
        status: 401,
        code: 'E_INVALID_CREDENTIALS',
      })
    }

    /**
     * Bonus
     * Account Lock
     */

    if (user.lockoutUntil && user.lockoutUntil > DateTime.now()) {
      throw new Exception(`Account locked until ${user.lockoutUntil.toISO()}`, {
        status: 401,
        code: 'E_ACCOUNT_LOCKED',
      })
    }

    const isPasswordValid = await hash.verify(user.password, payload.password)

    /**
     * Wrong Password
     */

    if (!isPasswordValid) {
      user.failedAttempts += 1

      if (user.failedAttempts >= 5) {
        user.lockoutUntil = DateTime.now().plus({
          minutes: 15,
        })
      }

      await user.save()

      throw new Exception('Invalid email or password', {
        status: 401,
        code: 'E_INVALID_CREDENTIALS',
      })
    }

    /**
     * Reset failed attempts
     */

    user.failedAttempts = 0
    user.lockoutUntil = null

    await user.save()

    /**
     * JWT
     */

    const accessToken = JwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    /**
     * Refresh Token
     */

    const tokenId = randomUUID()
    const secret = randomUUID()

    await RefreshToken.create({
      userId: user.id,
      tokenId,
      token: await hash.make(secret),
      expiresAt: DateTime.now().plus({ days: 7 }),
      ipAddress,
      userAgent,
    })

    const rawRefreshToken = `${tokenId}.${secret}`

    return {
      message: 'Login successful',

      accessToken,

      refreshToken: rawRefreshToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  static async refresh(refreshToken: string, ipAddress: string, userAgent: string) {
    /**
     * Expected format:
     * tokenId.secret
     */

    const parts = refreshToken.split('.')

    if (parts.length !== 2) {
      throw new Exception('Invalid refresh token', {
        status: 401,
        code: 'E_INVALID_REFRESH_TOKEN',
      })
    }

    const [tokenId, secret] = parts

    const token = await RefreshToken.query().where('token_id', tokenId).preload('user').first()

    if (!token) {
      throw new Exception('Refresh token not found', {
        status: 401,
        code: 'E_REFRESH_TOKEN_NOT_FOUND',
      })
    }

    if (token.revokedAt) {
      throw new Exception('Refresh token revoked', {
        status: 401,
        code: 'E_REFRESH_TOKEN_REVOKED',
      })
    }

    if (token.expiresAt < DateTime.now()) {
      throw new Exception('Refresh token expired', {
        status: 401,
        code: 'E_REFRESH_TOKEN_EXPIRED',
      })
    }

    const verified = await hash.verify(token.token, secret)

    if (!verified) {
      throw new Exception('Invalid refresh token', {
        status: 401,
        code: 'E_INVALID_REFRESH_TOKEN',
      })
    }

    const trx = await db.transaction()

    try {
      token.useTransaction(trx)

      token.revokedAt = DateTime.now()

      await token.save()

      const newTokenId = randomUUID()

      const newSecret = randomUUID()

      await RefreshToken.create(
        {
          userId: token.userId,
          tokenId: newTokenId,
          token: await hash.make(newSecret),
          expiresAt: DateTime.now().plus({ days: 7 }),
          ipAddress,
          userAgent,
        },
        { client: trx }
      )

      const accessToken = JwtService.generateAccessToken({
        id: token.user.id,
        email: token.user.email,
        role: token.user.role,
      })

      await trx.commit()

      return {
        accessToken,
        refreshToken: `${newTokenId}.${newSecret}`,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async logout(refreshToken: string) {
    const parts = refreshToken.split('.')

    if (parts.length !== 2) {
      throw new Exception('Invalid refresh token', {
        status: 401,
        code: 'E_INVALID_REFRESH_TOKEN',
      })
    }

    const [tokenId, secret] = parts

    const token = await RefreshToken.findBy('tokenId', tokenId)

    if (!token) {
      throw new Exception('Refresh token not found', {
        status: 401,
        code: 'E_REFRESH_TOKEN_NOT_FOUND',
      })
    }

    const isValid = await hash.verify(token.token, secret)

    if (!isValid) {
      throw new Exception('Invalid refresh token', {
        status: 401,
        code: 'E_INVALID_REFRESH_TOKEN',
      })
    }

    if (token.revokedAt) {
      throw new Exception('Refresh token already revoked', {
        status: 401,
        code: 'E_REFRESH_TOKEN_REVOKED',
      })
    }

    const trx = await db.transaction()

    try {
      token.useTransaction(trx)

      token.revokedAt = DateTime.now()

      await token.save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
