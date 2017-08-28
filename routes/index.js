var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ restEndpointTest: 1 }));
});

module.exports = router;
