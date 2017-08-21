const config = require('./config')
const http = require('http')
const Koa = require('koa')

const app = new Koa()

const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')

const routes = require('./routes')

if (!config.env.isTest) {
  app.use(responseTime())
  app.use(helmet())
}

app.use(logger())

app.use(cors(config.cors))
app.use(bodyParser(config.bodyParser))

app.use(routes.routes())
app.use(routes.allowedMethods())

app.server = require('http-shutdown')(http.createServer(app.callback()))

app.shutDown = function shutDown() {
  let err

  console.log('Shutdown')

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error)
        err = error
      }

      // this.db.destroy()
      //   .catch(error => {
      //     console.error(error)
      //     err = error
      //   })
      //   .then(() => process.exit(err ? 1 : 0))
    })
  }
}

module.exports = app
