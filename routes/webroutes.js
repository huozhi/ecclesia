var express = require('express');
var router = express.Router();
var auth = require('../controllers').auth;
var home = require('../controllers').home;

router.get('/', auth.index);
router.get('/login', auth.loginView);
router.post('/register', auth.registerAction);
router.post('/login', auth.loginAction);

router.get('/home/', home.index);
router.get('/logout', home.logout);
router.post('/home/create', home.createRoom);
router.post('/home/join', home.joinRoom);


module.exports = router;