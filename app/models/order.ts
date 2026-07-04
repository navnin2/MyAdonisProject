import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Customer from './customer.js'
import OrderItem from './order_item.js'

export default class Order extends BaseModel {
  static table = 'orders'

  static $columns = [
    'id',
    'customerId',
    'status',
    'totalAmount',
    'orderedAt',
    'createdAt',
    'updatedAt',
  ] as const

  $columns = Order.$columns

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare status: 'pending' | 'paid' | 'cancelled' | 'delivered'

  @column()
  declare totalAmount: number

  @column.dateTime()
  declare orderedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>
}