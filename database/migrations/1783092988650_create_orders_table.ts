import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

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
        .enum('status', [
          'pending',
          'paid',
          'cancelled',
          'delivered',
        ])
        .notNullable()
        .defaultTo('pending')

      table.decimal('total_amount', 10, 2).notNullable()

      table.timestamp('ordered_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Used when fetching all orders of a customer
      table.index(['customer_id'])

      // Used for revenue reports and restock alerts
      table.index(['status'])

      // Used for monthly revenue query
      table.index(['ordered_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}