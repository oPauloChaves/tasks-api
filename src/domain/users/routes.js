const Router = require('koa-router')
const jwt = require('koa-jwt')
const ctrl = require('./controller')
const {getAuth} = require('../../lib/helpers')

const router = new Router()

router.get('/users', getAuth(), ctrl.list)
router.post('/users', ctrl.register)
router.post('/login', ctrl.login)

module.exports = router.routes()
