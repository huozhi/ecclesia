var router = reuqire('express')().Router;

router.get('/', function (req, res) {
  res.render('chat');
});

module.exports = router;