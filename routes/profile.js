/**
 * Created by atomic on 5/1/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile', { title: 'Profile' });
});

module.exports = router;
