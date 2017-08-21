/** see https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/ */
'use strict'
const crypto = require('crypto')

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length)   /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function (password, salt) {
  var hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
  hash.update(password)
  var value = hash.digest('hex')
  return { salt, hash: value }
}

/**
 * Generate a password with salt and hash
 * @param {string} - User password to encrypt
 */
function saltHashPassword(userpassword) {
  var salt = genRandomString(16) /** Gives us salt of length 16 */
  var saltHash = sha512(userpassword, salt)
  return saltHash
}

/**
 * Compare the password from the request with the hashed password stored
 * @function
 * @param {string} - Candidate password
 * @param {object} - password (salt and hash) stored in users collection
 */
function comparePassword(candidatePassword, dbPassword) {
  const reqHashPass = sha512(candidatePassword, dbPassword.salt)
  return reqHashPass.hash === dbPassword.hash
}

module.exports = {
  saltHashPassword,
  comparePassword
}
