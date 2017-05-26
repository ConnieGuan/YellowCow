var express = require('express');
var router = express.Router();
var helpers = require('../helper/data');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('--- on / page, user: ' + req.session.user);
    if (!req.session.user) {
        res.render('login', { layout: false, title: 'Login', success: req.session.success , errors: req.session.errors });
        req.session.errors = null;
    } else {
        res.redirect('/home');
    }
});

/**
 * Login entry for main login page
 */
router.post('/submit', function (req, res, next) {
    var user = req.body.username,
        pass = req.body.password;

    console.log('before checking');
    req.check('username', 'User does not exist').isUserExists();
    req.check('username', 'Invalid password').loginSuccess(pass);
    req.check('password', 'Password must be at least 4 characters').isLength({min:4});

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        // res.redirect('/');
        res.status(409).redirect('/' );
    } else {
        req.session.success = true;
    }

    req.session.user = user;
    res.redirect('/home');
});

/**
 * api entry with no interface
 */
router.post('/login', function (req, res) {
    var user = req.body.username,
        pass = req.body.password;

    if (user) {
        res.status(409).send({'error': 'You already logged in' });
    }

    req.session.user = user;
    req.check('username', 'User does not exist').isUserExists();
    req.check('username', 'Invalid password').loginSuccess(pass);
    req.check('password', 'Password must be at least 4 characters').isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        // res.redirect('/');
        res.status(409).send({ 'errors': errors});
    } else {
        req.session.success = true;
        return res.status(200).send({"user": req.session.user , sid: req.sessionID });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    return res.status(200);
});

router.post('/signup', function (req, res, next) {

    console.log(req.body);
    req.check('username','Username taken').isNewUser();
    req.check('password', 'Password must be more than 4 characters').isLength({min:4});
    req.check('password', 'Confirmed password is not equal').equals(req.body.pswrepeat);

    var errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        console.log('return 409 because of errors + ' +  errors);
        return res.status(409).send( errors );
    } else {
        req.session.success = true;
        helpers.createUser(req.body.username, req.body.password);
        console.log('--- id creation successful');
        res.send({success: true, user: req.body.username});
    }
});


module.exports = router;
