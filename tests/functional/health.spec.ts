import { test } from '@japa/runner'

test.group('Health Endpoint', () => {
  test('returns application health', async ({ client }) => {
    const response = await client.get('/health')

    response.assertStatus(200)

    response.assertBodyContains({
      status: 'ok',
    })

    response.assertBodyContains({
      uptime: response.body().uptime,
      timestamp: response.body().timestamp,
    })
  })
})