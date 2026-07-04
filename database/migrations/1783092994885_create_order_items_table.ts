import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.integer('quantity').notNullable()

      // Price when customer purchased
      table.decimal('unit_price', 10, 2).notNullable()

      table.decimal('subtotal', 10, 2).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Fast join from orders
      table.index(['order_id'])

      // Used for sales analytics
      table.index(['product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}