var express = require('express');
var router = express.Router();

// This only has the home page
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Post CodeSnippets' });
});

module.exports = router;
