import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  //The response object is destructured but never used. This isn't a runtime error, but it's unnecessary and may trigger TypeScript/ESLint warnings.

  //   async index({ response }: HttpContext) {
  //     const users = await User.all()
  //     return users
  //   }

  async index() {
    return await User.all()
  }

  async store({ request, response }: HttpContext) {
    //request.body() returns the raw request body.
    // const { name, email } = request.body()

    //This prevents unwanted fields from being processed.
    const { name, email } = request.only(['name', 'email'])
    if (!name || !email) {
      //The response is sent, but execution continues. The code tries to create the user and send another response.
      //   response.status(400).json({ error: 'Missing fields' })
      return response.status(400).json({ error: 'Missing fields' })
    }

    const user = await User.create({ fullName: name, email })

    //AdonisJS doesn't have response.json().
    // response.status(201).json(user)
    return response.status(201).send(user)
  }

  async crash({ response }: HttpContext) {
    try {
      //riskyOperation() throws error Without handling it, the request fails.
      // so used globle handler to catch the error and return a 500 response.
      const data = await this.riskyOperation()
      return response.send(data)
    } catch {
      return response.status(500).send({
        error: 'Internal Server Error',
      })
    }
  }

  riskyOperation() {
    throw new Error('Boom')
  }
}
