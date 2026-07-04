import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class JwtService {
  static generateAccessToken(payload: object) {
    const secret = env.get('JWT_SECRET') as string
    const expiresIn = env.get('JWT_EXPIRES_IN') as jwt.SignOptions['expiresIn']

    return jwt.sign(payload, secret, {
      expiresIn,
    })
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.get('JWT_SECRET'))
  }
}