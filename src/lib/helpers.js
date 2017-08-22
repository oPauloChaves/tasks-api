const jwt = require('jsonwebtoken')
const {jwtSecret, jwtOptions} = require('../config')

module.exports = {

  generateToken(user) {
    const {id, email} = user
    const token = jwt.sign({id, email}, jwtSecret, jwtOptions)
    return token
  }

}
