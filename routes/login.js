var express = require('express');
var router = express.Router();

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
    return res.status(200).send({sid: req.sessionID });
});

router.post('/signup', function (req, res, next) {
    // check validity

    console.log(req.body);
    req.check('username', 'Invalid username').isEmail();
    req.check('password', 'Password is invalid').isLength({min:4}).equals(req.body.pswrepeat);

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/');
    } else {
        req.session.success = true;
    }
    console.log(errors);
    console.log('--- id creation successful, go to home page');

    // TODO: for now save user id,pass to file


    // res.redirect('/home');
    res.send({success: true});
});


module.exports = router;
