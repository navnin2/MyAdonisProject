import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('role', ['admin', 'manager', 'staff'])
        .defaultTo('staff')
        .notNullable()

      table.integer('failed_attempts').defaultTo(0)

      table.timestamp('lockout_until').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('failed_attempts')
      table.dropColumn('lockout_until')
    })
  }
}