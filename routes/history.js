var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.post('/query-history', function(req, res){

});

router.get('/historyDetail', function (req, res) {
  res.render('historyDetail');
});

module.exports = router;
