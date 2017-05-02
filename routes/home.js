var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home', 'data': data });
});

router.post('/add_comments', function (req, res, next) {
    console.log('id: ' + req.body.id);
    console.log('comment: ' + req.body.comment);
    data.features[req.body.id].comments.push( req.body.comment );
    console.log(data.features[req.body.id]);

    fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('New Comment Added');
    });

    res.redirect('/home');
});

module.exports = router;
