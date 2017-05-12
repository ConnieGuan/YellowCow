var express = require('express');
var router = express.Router();
var data = require('../data.json');

router.get('/data', function(req, res, next) {
    res.send(data);
});

module.exports = router;
