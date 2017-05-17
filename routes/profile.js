/**
 * Created by atomic on 5/1/17.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile', { title: 'Profile', 'data': data });
});

/**
 * check if session is on
 */
router.get('/board', function (req, res, next) {
    console.log(req.session.user + ' is on /board');
    if (!req.session.user) {
        return res.status(401).send();
    }
    //noinspection JSUnresolvedVariable
    return res.status(200).send( { user: req.session.user, sid: req.sessionID });
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
