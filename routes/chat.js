var express = require('express'); 
var router = express.Router();
/*var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs');*/


router.get('/', function (req, res) {
  res.render('chat');
});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  console.log(req.body);
  if (t == undefined) {
    return res.send('1');
  }
  else
    return res.send('2');
});

module.exports = router;