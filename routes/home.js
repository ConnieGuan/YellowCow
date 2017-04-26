var express = require('express');
var router = express.Router();
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('afsdfs dsf sdf sdf asdf');
    res.render('home', { title: 'Home', 'data': data });
});

module.exports = router;
