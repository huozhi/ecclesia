const express = require('express')
const passport = require('passport')
const auth = require('./controllers').auth
const home = require('./controllers').home
const history = require('./controllers').history
const chat = require('./controllers').chat
const router = express.Router()

const strategy = passport.authenticate('local', {failureRedirect: '/'})

// index
router.get('/', auth.index)
router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.get('/logout', auth.logout)

router.post('/create', home.createRoom)
router.post('/join', home.joinRoom)


router.get('/history', history.index)
router.get('/history/detail', history.getDiscussDetail)

router.get('/chat', chat.index)
router.post('/chat/sync', chat.sync)
router.post('/chat/upload/:type', chat.upload)



module.exports = router
