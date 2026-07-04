import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Category from './category.js'
import OrderItem from './order_item.js'
import Review from './review.js'

export default class Product extends BaseModel {
  static table = 'products'

  static $columns = [
    'id',
    'categoryId',
    'name',
    'description',
    'price',
    'stock',
    'isActive',
    'createdAt',
    'updatedAt',
  ] as const

  $columns = Product.$columns

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>
}
