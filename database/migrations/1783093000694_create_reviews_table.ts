import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE')

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.integer('rating').notNullable()

      table.text('comment').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Used for average rating query
      table.index(['product_id'])

      // Used for silent customer query
      table.index(['customer_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
