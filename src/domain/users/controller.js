const User = require('./model')
const {generateToken} = require('../../lib/helpers')
const {NotFoundError, UnauthorizedError} = require('../../lib/errors')

module.exports = {

  async get (ctx) {
    const {skip, limit} = ctx.query

    const users = await User.list({skip, limit})

    ctx.body = {users}
  },

  async register(ctx) {
    const {body} = ctx.request
    let {user = {}} = body

    const opts = {abortEarly: false, context: {validatePassword: true}}

    user = await ctx.app.schemas.user.validate(user, opts)

    user = await new User(user).save()

    ctx.status = 201
    ctx.set('Location', `${ctx.URL}/${user.id}`)

    const token = generateToken(user)
    ctx.body = {token}
  },

  async login(ctx) {
    const {body} = ctx.request
    let {user = {}} = body

    login = await ctx.app.schemas.login.validate(user, {abortEarly: false})

    const existingUser = await User.findByEmail(user.email)

    if (!existingUser) {
      throw new NotFoundError(`User with email ${user.email} not found`)
    }

    if (!await existingUser.passwordMatches(user.password)) {
      throw new UnauthorizedError(`Email or password is invalid`)
    }

    const token = generateToken(existingUser)
    ctx.body = {token}
  }
}
