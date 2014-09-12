var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('history');
});

router.post('/query-history', function (req, res){
  console.log(req.body.data);
})

module.exports = router;
