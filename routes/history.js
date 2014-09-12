var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.get('/get-all-history', function (req, res) {
  
});
module.exports = router;
