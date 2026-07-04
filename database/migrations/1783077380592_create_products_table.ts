import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary Key
      table.increments('id').notNullable()

      // Product Name
      table.string('name').notNullable()

      // Description (Optional)
      table.text('description').nullable()

      // Price (10 digits total, 2 decimal places)
      table.decimal('price', 10, 2).notNullable()

      // Stock
      table.integer('stock').notNullable().defaultTo(0)

      // Category Enum
      table.enum('category', ['electronics', 'clothing', 'food', 'other']).notNullable()

      // Active Status
      table.boolean('is_active').defaultTo(true)

      // Created & Updated timestamps
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      // Soft Delete timestamp
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
