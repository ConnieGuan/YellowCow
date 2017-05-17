/**
 * Created by atomic on 5/1/17.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');
var helpers = require('../helper/data');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('--- on /profile page, user: ' + req.session.user);

    /** Anonymous should not have profile page */
    if (!req.session.user) {
        res.redirect('/login');
        req.session.errors = null;
    }

    // get user's post id
    var post_ids = helpers.getUser(req.session.user).posts;
    var userposts = data.features.filter(x => post_ids.indexOf(x.id) > -1 );

    console.log(userposts);
    res.render('profile', { title: 'Profile', 'user_posts' : userposts, 'post_exists': (userposts.length > 0)});
});

/**
 * API check if session is on
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

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
