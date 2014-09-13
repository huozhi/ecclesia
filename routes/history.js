var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.post('/query-history', function (req, res){
  //req.accepts("application/json");
  console.log(req.body.date);
});

router.get('/history-detail', function (req, res) {
  res.render('history-detail');
});

module.exports = router;
