var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.get('/historyDetail', function (req, res) {
  res.render('historyDetail');
});

router.get('/get-all-history', function (req, res) {
 
});
module.exports = router;
