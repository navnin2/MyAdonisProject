import { test } from '@japa/runner'
import env from '#start/env'

test.group('Health API', () => {
  test('should return server health information', async ({ client, assert }) => {
    const response = await client.get('/health')

    response.assertStatus(200)

    const body = response.body()

    assert.equal(body.status, 'OK')
    assert.equal(body.port, env.get('PORT'))
    assert.equal(body.database, env.get('MYSQL_DB_NAME'))

    assert.isNumber(body.uptime)
    assert.isAtLeast(body.uptime, 0)

    assert.isString(body.timestamp)
    assert.isFalse(Number.isNaN(Date.parse(body.timestamp)))
  })
})