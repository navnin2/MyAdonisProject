import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'refresh_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // Store only hashed refresh token
      table.string('token').notNullable()

      table.uuid('token_id').unique().notNullable()

      table.timestamp('expires_at').notNullable()

      table.timestamp('revoked_at').nullable()

      table.string('ip_address').nullable()

      table.string('user_agent').nullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
