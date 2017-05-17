var express = require('express');
var router = express.Router();
var helpers = require('../helper/data');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { layout: false, title: 'Login', success: req.session.success , errors: req.session.errors });
    req.session.errors = null;
});

router.post('/submit', function (req, res, next) {
    // check validity
    // req.check('username', 'Invalid username').isEmail();
    req.check('password', 'Password is invalid').isLength({min:4});

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/');
    } else {
        req.session.success = true;
    }
    console.log('--- login successful, go to home page');
    res.redirect('/home');
});

router.post('/login', function (req, res) {
    var user = req.body.username,
        pass = req.body.password;

    // TODO: add checking whether user is in the database

    req.session.user = user;
    console.log('--- inside login: session is ...');
    console.log(req.session);
    return res.status(200).send({"user": req.session.user , sid: req.sessionID });
});

router.post('/signup', function (req, res, next) {

    req.check('username','Username taken').isNewUser();
    req.check('password', 'Password must be more than 4 characters').isLength({min:4});
    req.check('password', 'Confirmed password is not equal').equals(req.body.pswrepeat);

    var errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        return res.status(409).send( errors );
    } else {
        req.session.success = true;
        helpers.createUser(req.body.username, req.body.password);
        console.log('--- id creation successful');
    }
    res.send({success: true, user: req.body.username});
});


module.exports = router;
