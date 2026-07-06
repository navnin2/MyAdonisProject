/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import env from './env.ts'

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/health', async () => {
  return {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port: env.get('PORT'),
    database: env.get('MYSQL_DB_NAME'),
  }
})

router.get('admin/users', '#controllers/users_controller.index').use([
  middleware.auth(),
  middleware.rbac({
    roles: ['admin'],
  }),
])
router.post('/users', '#controllers/users_controller.store')
router.get('/crash', '#controllers/users_controller.crash')

router.get('/api/products', '#controllers/products_controller.index').use([
  middleware.auth(),
  middleware.rbac({
    roles: ['admin', 'manager'],
  }),
])

router.get('/api/products/:id', '#controllers/products_controller.show').use([
  middleware.auth(),
  middleware.rbac({
    roles: ['admin', 'manager'],
  }),
])

router.post('/api/products', '#controllers/products_controller.store')

router.put('/api/products/:id', '#controllers/products_controller.update').use([
  middleware.auth(),
  middleware.rbac({
    roles: ['admin', 'manager'],
  }),
])

router.delete('/api/products/:id', '#controllers/products_controller.destroy').use([
  middleware.auth(),
  middleware.rbac({
    roles: ['admin', 'manager'],
  }),
])

router
  .group(() => {
    router.get('/top-products', '#controllers/store_controller.topProducts')
    router.get('/restock-alerts', '#controllers/store_controller.restockAlerts')
    router.get('/revenue', '#controllers/store_controller.revenue')
    router.get('/silent-customers', '#controllers/store_controller.silentCustomers')
    router.get('/category-ratings', '#controllers/store_controller.categoryRatings')
  })
  .prefix('/api/store')

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')
router.post('/logout', '#controllers/auth_controller.logout').use([middleware.auth()])
