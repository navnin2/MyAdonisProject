import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Order from './order.js'
import Review from './review.js'

export default class Customer extends BaseModel {
  static table = 'customers'

  static $columns = [
    'id',
    'name',
    'email',
    'phone',
    'createdAt',
    'updatedAt',
  ] as const

  $columns = Customer.$columns

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>
}