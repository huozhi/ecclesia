var express = require('express');
var router = express.Router();

var User = require('../modules/user');
router.get('/', function(req, res) {
  res.render('login');
});

router.post('/loginCheck', function(req, res){
  var name = req.body.username;
  var pwd = req.body.userPwd;

  User.loginCheck(name, pwd, function(err, result){
      if(!err){
        if(result){
          req.session.username = name;
          res.send(result);
        }else{
          res.send(null);
        }        
      }
  });
});

module.exports = router;