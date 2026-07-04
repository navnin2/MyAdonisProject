import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import { DateTime } from 'luxon'

test.group('Login API', (group) => {
  group.each.setup(async () => {
    return testUtils.db().withGlobalTransaction()
  })

  /**
   * Happy Path
   */
  test('should login successfully with valid credentials', async ({ client, assert }) => {
    const password = 'Password@123'

    await User.create({
      email: 'adminlogin@test.com',
      password,
      role: 'admin',
    })

    const response = await client.post('/login').json({
      email: 'adminlogin@test.com',
      password,
    })

    response.assertStatus(200)

    const body: any = response.body()

    assert.exists(body.accessToken)
    assert.exists(body.refreshToken)

    assert.equal(body.user.email, 'adminlogin@test.com')
    assert.equal(body.user.role, 'admin')
  })

  /**
   * Wrong Password
   */
  test('should return 401 for wrong password', async ({ client, assert }) => {
    await User.create({
      email: 'admininvalid@test.com',
      password: 'Password@123',
      role: 'admin',
    })

    const response = await client.post('/login').json({
      email: 'admininvalid@test.com',
      password: 'WrongPassword',
    })

    response.assertStatus(401)

    const body: any = response.body()

    assert.equal(body.success, false)
    assert.equal(body.status, 401)

    // Change this if your AuthService throws a different message
    assert.equal(body.message, 'Invalid email or password')

    assert.exists(body.timestamp)
  })

  /**
   * User Not Found
   */
  test('should return 401 if user does not exist', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'nouser@test.com',
      password: 'Password@123',
    })

    response.assertStatus(401)

    const body: any = response.body()

    assert.equal(body.success, false)
    assert.equal(body.status, 401)
    assert.equal(body.message, 'Invalid email or password')

    assert.exists(body.timestamp)
  })

  /**
   * Locked Account
   */
  test('should return 401 for locked account', async ({ client, assert }) => {
    await User.create({
      email: 'locked@test.com',
      password: 'Password@123',
      role: 'staff',

      // Only if these columns exist
      failedAttempts: 5,
      lockoutUntil: DateTime.now().plus({ minutes: 15 }),
    })

    const response = await client.post('/login').json({
      email: 'locked@test.com',
      password: 'Password@123',
    })

    response.assertStatus(401)

    const body: any = response.body()

    // console.log('Locked Account Response Body:', body) // Debugging line
    assert.equal(body.success, false)
    assert.equal(body.status, 401)
    assert.match(body.message, /^Account locked until/)

    assert.exists(body.timestamp)
  })
})
