var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.get('/history-detail', function (req, res) {
  res.render('history-detail');
});

router.get('/get-all-history', function (req, res) {
 
});
module.exports = router;
