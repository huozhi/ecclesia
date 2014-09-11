var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  
})

router.get('/get-all-history', function (req, res) {
  res.render('history');
})

module.exports = router;
