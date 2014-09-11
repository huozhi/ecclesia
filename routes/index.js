var express = require('express');
var router = express.Router();

router.get('/chat', function(req, res) {
  res.render('chat');
})


module.exports = router;
