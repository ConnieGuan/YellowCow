var express = require('express');
var router = express.Router();
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map', { title: 'Pintura (Home)' , 'data': data});
});

module.exports = router;
