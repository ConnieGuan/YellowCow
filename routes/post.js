var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post', { title: 'Post Graffiti' });
});

router.get('/test', function (req, res, next) {
    res.redirect('/home');
});

router.post('/submit', function (req, res, next) {

    var title = req.body.title;
    var comment = req.body.comment;
    var lat = req.body.lat;
    var lng = req.body.lng;

    console.log('inside submit');
    console.log('title: '  + title);
    console.log('comment: ' + comment);
    console.log('lat:  ' + lat);
    console.log('lng:  ' + lng);

    data.features.push( {
        "title": title,
        "comment": comment,
        "geo": {
            "type": "Feature",
            "properties" : {
                "name": title,
                "popupContent": comment
            },
            "geometry": {
                "type": "Point",
                "coordinates" : [lng,lat]
            }
        }
    });

    console.log(data);

    fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('New graffiti is saved');
    });

    res.redirect('/home');

});

module.exports = router;
