const User = require('./model')

module.exports = {

  async get (ctx) {
    const {skip, limit} = ctx.query
    try {
      const users = await User.list({skip, limit})
      ctx.body = {users}
    } catch (error) {
      ctx.throw(500, error)
    }
  },

  async register(ctx) {
    const {body: {user}} = ctx.request

    const existingUser = await User.findByEmail(user.email)
    if (existingUser) {
      ctx.throw(422, 'Email already taken')
    }

    const newUser = new User(user)

    let err = newUser.validateSync()
    if (err) {
      ctx.throw(422, 'validation failed', err.errors)
    }

    try {
      const dbUser = await newUser.save()
      ctx.body = {user: dbUser}
    } catch (error) {
      ctx.throw(500, error)
    }
  }
}
