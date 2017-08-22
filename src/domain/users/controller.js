const _ = require('lodash')
const User = require('./model')

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
    ctx.set('Location', `${ctx.request.url}/${user.id}`)
    ctx.body = {user: _.pick(user, ['id', 'name', 'email'])}
  }
}
