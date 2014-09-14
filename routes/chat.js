var express = require('express'); 
var router = express.Router();
var formidable = require('formidable'),
var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');


router.get('/', function (req, res) {
  var uname = "test" || req.session.username;
  res.render('chat', {
    username: uname
  });
});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  Meeting.saveMdTemp(req.session.roomName, req.session.host, req.session.username, markdowns, function(err, result){
    if(!err){
      //do sth
    }
  });
  //console.log(req.body.text);
  if (t == undefined) {
    return res.send('1');
  }
  else
    return res.send('2');
});

module.exports = router;