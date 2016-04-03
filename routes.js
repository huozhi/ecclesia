var express = require('express')
var router = express.Router()
var auth = require('./controllers').auth
var home = require('./controllers').home
var history = require('./controllers').history
var chat = require('./controllers').chat

// index
router.get('/', auth.index)
router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.get('/logout', auth.logout)

// home views
router.get('/home', home.index)
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
