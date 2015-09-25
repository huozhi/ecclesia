var express = require('express')
var router = express.Router()
var auth = require('./controllers').auth
var home = require('./controllers').home
var history = require('./controllers').history
var chat = require('./controllers').chat

// index
router.get('/', auth.index)
router.get('/login', auth.loginView)
router.post('/register', auth.registerAction)
router.post('/login', auth.loginAction)

// home views
router.get('/home/', home.index)
router.get('/logout', home.logout)
router.post('/home/create', home.createRoom)
router.post('/home/join', home.joinRoom)

// history views
router.get('/history', history.index)
router.get('/history/detail', history.getDiscussDetail)

// chat views
router.get('/chat', chat.index)
router.post('/chat', chat.sync)
router.post('/chat/upload/:type', chat.upload)


// router.post('/query-img', )
// router.post('/room/outline', )


module.exports = router
