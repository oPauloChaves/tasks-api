const mongoose = require('mongoose')
const passwd = require('../../utils/password')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: Schema.Types.Mixed,
    required: true
  },
  password_reset_expires: {
    type: Schema.Types.Date
  },
  password_reset_token: {
    type: String
  }
}, { timestamps: true })

/**
 * see https://github.com/sahat/hackathon-starter
 */
UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  const saltHash = passwd.saltHashPassword(user.password)
  user.password = saltHash
  next()
})

UserSchema.methods = {
  comparePassword (candidatePassword, cb) {
    const isMatch = passwd.comparePassword(candidatePassword, this.password)
    cb(null, isMatch)
  }
}

UserSchema.statics = {

  async get(id) {
    const user = await this.findById(id).exec()

    if (user) return user

      let error = new Error('No such user exists!')
      error.status = 404
      return Promise.reject(error)
  }

}

module.exports = mongoose.model('User', UserSchema)
