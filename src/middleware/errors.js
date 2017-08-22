const http = require('http')

const errors = require('../lib/errors')
let constants = require('../lib/constants')
// const _ = require('lodash')

Object.entries(http.STATUS_CODES).forEach(([key, value]) => {
  constants.HTTP[key] = value
    .toUpperCase()
    .replace(/\s/igm, '_')
})

module.exports = async (ctx, next) => {
  try {
    await next()
    if (Number(ctx.response.status) === 404 && !ctx.response.body) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.type = 'application/json'

    if (!ctx.response.body) {
      ctx.response.body = { errors: {} }
    }
    // ctx.app.emit('error', err, ctx);
    console.error(err)

    switch (true) {
      case err instanceof errors.ValidationError: {
        ctx.body.errors = formatValidationError(err)
        ctx.status = err.status || 422
        break
      }

      case err instanceof errors.DuplicateKeyError: {
        ctx.body.errors = formatException(err)
        ctx.status = err.status || 422
        break
      }

      case err instanceof errors.UnauthorizedError: {
        ctx.body.errors = formatException(err)
        ctx.status = err.status || 401
        break
      }

      default:
        ctx.status = err.status || 500
        break
    }
  } finally {
    if (ctx.body && !ctx.body.code) {
      ctx.body.code = constants.HTTP[String(ctx.status)]
    }
  }
}

function formatValidationError(err) {
  const result = {}
  if (err.path) {
    result[err.path] = err.message || 'is not valid'
  }
  if (err.inner && err.inner.length > 0) {
    err.inner
      .map(err => formatValidationError(err))
      .reduce((prev, curr) => (Object.assign(prev, curr)), result)
  }
  return result
}

function formatException(err) {
  let path = 'unknown'
  let message = err.message
  const idx = err.message.indexOf(';')
  if (idx !== -1) {
    path = err.message.substring(0, idx)
    message = err.message.substring(idx+1)
    return {[path]: message}
  }
  return message
}
