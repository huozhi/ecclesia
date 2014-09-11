var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.isLogin == true){
      res.render('home');
  }else{
    res.redirect('/login');
  }
})

router.get('/logout', function(req, res){
  if(req.session.isLogin == true){
    req.session.destroy(function(err){
        if(!err){
          res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
})

router.get('/history', function(req, res) {
  res.render('history');
});

module.exports = router;


