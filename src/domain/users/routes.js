const Router = require('koa-router')
const ctrl = require('./controller')
const router = new Router()

router.get('/users', ctrl.get)
router.post('/users', ctrl.register)
router.post('/login', ctrl.login)

module.exports = router.routes()
