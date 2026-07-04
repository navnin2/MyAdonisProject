import vine from '@vinejs/vine'

/**
 * Used for POST /products
 * All required fields must be provided.
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),

    description: vine.string().trim().optional(),

    price: vine.number().positive(),

    stock: vine.number().min(0),

    category: vine.enum([
      'electronics',
      'clothing',
      'food',
      'other',
    ]),

    isActive: vine.boolean(),
  })
)

/**
 * Used for PUT /products/:id
 * Full replacement, so every field is required.
 */
export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),

    description: vine.string().trim().optional(),

    price: vine.number().positive(),

    stock: vine.number().min(0),

    category: vine.enum([
      'electronics',
      'clothing',
      'food',
      'other',
    ]),

    isActive: vine.boolean(),
  })
)

/**
 * Used for PATCH /products/:id
 * Only supplied fields are validated.
 */
export const patchProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),

    description: vine.string().trim().optional(),

    price: vine.number().positive().optional(),

    stock: vine.number().min(0).optional(),

    category: vine
      .enum([
        'electronics',
        'clothing',
        'food',
        'other',
      ])
      .optional(),

    isActive: vine.boolean().optional(),
  })
)