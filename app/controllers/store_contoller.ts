import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

import Product from '#models/product'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Customer from '#models/customer'
import Category from '#models/category'

export default class StoreController {
  /**
   * GET /api/store/top-products?month=2024-01
   */
  async topProducts({ request, response }: HttpContext) {
    const month = request.input('month')

    if (!month) {
      throw new Exception('Month is required. Example: 2024-01', {
        status: 400,
        code: 'E_BAD_REQUEST',
      })
    }

    const products = await OrderItem.query()
      .join('orders', 'orders.id', 'order_items.order_id')
      .join('products', 'products.id', 'order_items.product_id')
      .join('categories', 'categories.id', 'products.category_id')
      .whereRaw("DATE_FORMAT(orders.ordered_at,'%Y-%m') = ?", [month])
      .groupBy('products.id', 'products.name', 'categories.name')
      .select('products.name as product', 'categories.name as category')
      .sum('order_items.quantity as unitsSold')
      .sum('order_items.subtotal as revenue')
      .orderBy('unitsSold', 'desc')
      .limit(5)

    return response.ok({
      success: true,
      message: 'Top products fetched successfully',
      data: products,
    })
  }

  /**
   * GET /api/store/restock-alerts
   */
  async restockAlerts({ response }: HttpContext) {
    const products = await Product.query()
      .where('stock', '<', 10)
      .whereHas('orderItems', (query) => {
        query.whereHas('order', (orderQuery) => {
          orderQuery.whereIn('status', ['pending', 'paid'])
        })
      })
      .preload('category')

    return response.ok({
      success: true,
      message: 'Restock alerts fetched successfully.',
      data: products,
    })
  }

  /**
   * GET /api/store/revenue
   */
  async revenue({ response }: HttpContext) {
    const revenue = await Order.query()
      .select("DATE_FORMAT(ordered_at,'%Y-%m') as month")
      .count('* as totalOrders')
      .sum('total_amount as revenue')
      .avg('total_amount as averageOrder')
      .groupByRaw("DATE_FORMAT(ordered_at,'%Y-%m')")
      .orderBy('month', 'desc')
      .limit(12)

    return response.ok({
      success: true,
      message: 'Monthly revenue fetched successfully.',
      data: revenue,
    })
  }

  /**
   * GET /api/store/silent-customers
   */
  async silentCustomers({ response }: HttpContext) {
    const customers = await Customer.query()
      .whereHas('orders', (query) => {
        query.groupBy('customer_id').havingRaw('COUNT(*) > 3')
      })
      .whereDoesntHave('reviews', () => {})

    return response.ok({
      success: true,
      message: 'Silent customers fetched successfully.',
      data: customers,
    })
  }

  /**
   * GET /api/store/category-ratings
   */
  async categoryRatings({ response }: HttpContext) {
    const ratings = await Category.query()
      .join('products', 'products.category_id', 'categories.id')
      .join('reviews', 'reviews.product_id', 'products.id')
      .groupBy('categories.id', 'categories.name')
      .select('categories.name as category')
      .avg('reviews.rating as averageRating')
      .count('reviews.id as totalReviews')
      .havingRaw('COUNT(reviews.id) >= 5')
      .orderBy('averageRating', 'desc')

    return response.ok({
      success: true,
      message: 'Category ratings fetched successfully.',
      data: ratings,
    })
  }
}
