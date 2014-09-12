var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('history');
})
router.get('/historyDetail', function(req, res) {
  res.render('historyDetail');
})
module.exports = router;
