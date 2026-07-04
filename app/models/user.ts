import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import RefreshToken from './refresh_token.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'admin' | 'manager' | 'staff'

  @column()
  declare failedAttempts: number

  @column.dateTime()
  declare lockoutUntil: DateTime | null

  @hasMany(() => RefreshToken)
  declare refreshTokens: HasMany<typeof RefreshToken>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  get initials() {
    if (this.name) {
      const [first, last] = this.name.split(' ')

      if (first && last) {
        return `${first[0]}${last[0]}`.toUpperCase()
      }

      return first.substring(0, 2).toUpperCase()
    }

    return this.email.substring(0, 2).toUpperCase()
  }
}