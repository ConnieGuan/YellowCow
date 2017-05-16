/**
 * Created by atomic on 5/1/17.
 */
var express = require('express');
var router = express.Router();
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile', { title: 'Profile', 'data': data });
});

module.exports = router;
