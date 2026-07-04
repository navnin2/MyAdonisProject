import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import Product from "./product.ts"
import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'

export default class Category extends BaseModel {
  static table = 'categories'

  static $columns = [
    'id',
    'name',
    'parentId',
    'createdAt',
    'updatedAt',
  ] as const

  $columns = Category.$columns

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare parentId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /*
  |--------------------------------------------------------------------------
  | Relationships
  |--------------------------------------------------------------------------
  */

  // One category has many products
  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  // Parent Category
  @belongsTo(() => Category, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Category>

  // Child Categories
  @hasMany(() => Category, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof Category>
}