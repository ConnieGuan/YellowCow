var express = require('express');
var router = express.Router();
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

module.exports = router;
