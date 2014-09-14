var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if(req.session.username){
      res.render('home');
  }else{
    res.redirect('/login');
  }
})

router.get('/logout', function (req, res) {
  if(req.session.username){
    req.session.destroy(function(err){
        if(!err){
          res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
})

router.get('/create-room', function (req, res) {
  // deal with post json data 
  // { request:'create-room' username:'..', roomname:'..' }
  // ... code here
});

module.exports = router;
