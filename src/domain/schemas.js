const user = require('./users/schema')

module.exports = (app) => {
  app.schemas = {
    user
  }
}
