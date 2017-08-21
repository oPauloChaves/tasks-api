module.exports = {

  async get (ctx) {
    const user = {name: 'API'}

    ctx.body = {user}
  },

}
