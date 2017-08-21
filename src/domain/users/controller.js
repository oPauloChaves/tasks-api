const User = require('./model')

module.exports = {

  async get (ctx) {
    const user = {name: 'API'}

    ctx.body = {user}
  },

}
