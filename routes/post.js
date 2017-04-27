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
        "comments": [],
        "vote": 0,
        "nsfw": false,


        "geo": {
            "type": "Feature",

            // TODO: For now use sample external image, later after image upload to server works, use link to local image
            "link": "https://us.123rf.com/450wm/zazamedia/zazamedia1409/zazamedia140900289/31596594-coming-soon-icon-sign.jpg?ver=6",

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
