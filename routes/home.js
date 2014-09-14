var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if(req.session.username){
      res.render('home');
  }else{
    res.redirect('/');
  }
})

router.get('/logout', function (req, res) {
  if(req.session.username){
    req.session.destroy(function(err){
        if(!err){
          res.redirect('/');
        }
    });
  }else{
    res.redirect('/');
  }
})

router.get('/create-room', function (req, res) {
  // deal with post json data 
  // { request:'create-room' username:'..', roomname:'..' }
  // ... code here
});

module.exports = router;
