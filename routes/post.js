var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');
var helpers = require("../helper/data.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    /** not sure */
    if (!req.session.user) {
        res.redirect('/login');
        req.session.errors = null;
    }

    console.log('--- on /post page, user: ' + req.session.user);
    res.render('post', { title: 'Post Graffiti' });
});

router.get('/test', function (req, res, next) {
    res.redirect('/home');
});

router.post('/submit_canvas', function (req, res, next) {
    let dataURL = req.body.imgBase64;
    dataURL =  dataURL.replace(/^data:image\/\w+;base64,/, "");
    dataURL =  dataURL.replace(/ /g, '+');


    // Save the dataURL image to public/graffiti/...
    fs.writeFile('./public/graffiti/' + data.total + '.png', dataURL, 'base64', function(err) {
        console.log(err);
    });
    res.end();
});

router.post('/submit', function (req, res, next) {

    const title = req.body.title,
        description = req.body.description,
        lat = req.body.lat,
        lng = req.body.lng;
    //Canvas URL
    // const myCanvas = req.query.canvas;
    // var url = myCanvas.toDataURL();


    data.features.unshift( {
        "id": data.total,
        "title": title,
        "user": req.session.user,
        "description": description,
        "comments": [],
        "votes": 0,
        "nsfw": false,


        "geo": {
            "type": "Feature",
            "link": '/graffiti/' + data.total + '.png',
            "properties" : {
                "name": title,
                "popupContent": description
            },
            "geometry": {
                "type": "Point",
                "coordinates" : [lng,lat]
            }
        }
    });
    helpers.addPost(req.session.user, data.total);
    data.total = data.total + 1;

    helpers.updateData(data);
    res.redirect('/home');
});

router.post('/delete', function (req, res) {
    let id = parseInt(req.body.id);
    let i = data.features.findIndex(item => item.id === id);
    let deleted = data.features.splice(i, 1);
    console.log(`--- index of id : ${id} list to delete: ${i}`);
    console.log('--- total data before deletion: ' + helpers.totalPost() );
    helpers.updateData(data);
    console.log('--- total data after deletion: ' + helpers.totalPost() );
    res.send( {index: i, title: deleted.title, post: deleted} );
});

router.post('/vote', function(req, res, next) {
    let value = req.body.value,
        id = req.body.id;

    console.log('inside /post/vote, id=' + id + ', val:' + value);

    var post = data.features.find(x => x.id == id );
    post.votes = parseInt(post.votes) + parseInt(value);

    helpers.updateData(data);
    res.send({'id': post.id, voted: post.votes});
});

module.exports = router;
