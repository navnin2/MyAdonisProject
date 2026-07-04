import type { HttpContext } from '@adonisjs/core/http'

import Product from '#models/product'

import {
  createProductValidator,
  updateProductValidator,
  patchProductValidator,
} from '#validators/product'

import { DateTime } from 'luxon'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search')

    const query = Product.query().whereNull('deleted_at')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    const products = await query.paginate(page, limit)

    response.header('X-Total-Count', products.total)

    return products
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.query().where('id', params.id).whereNull('deleted_at').first()

    if (!product) {
      return response.status(404).send({
        message: 'Product not found',
      })
    }

    return product
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await Product.create({
      ...payload,
    })

    return response.status(201).send(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.query().where('id', params.id).whereNull('deleted_at').first()

    if (!product) {
      return response.status(404).send({
        message: 'Product not found',
      })
    }

    const payload = await request.validateUsing(updateProductValidator)

    product.merge(payload)

    await product.save()

    return product
  }

  async patch({ params, request, response }: HttpContext) {
    const product = await Product.query().where('id', params.id).whereNull('deleted_at').first()

    if (!product) {
      return response.status(404).send({
        message: 'Product not found',
      })
    }

    const payload = await request.validateUsing(patchProductValidator)

    product.merge(payload)

    await product.save()

    return product
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.query().where('id', params.id).whereNull('deleted_at').first()

    if (!product) {
      return response.status(404).send({
        message: 'Product not found',
      })
    }

    product.deletedAt = DateTime.now()

    await product.save()

    return response.status(204)
  }
}
