var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { layout: false, title: 'Login' });
});

router.post('/', function(req, res, next) {
    // TODO: implement user authentication here
    res.redirect('home');
});

module.exports = router;
