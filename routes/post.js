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

    const title = req.body.title;
    const comment = req.body.comment;
    const lat = req.body.lat;
    const lng = req.body.lng;
    //Canvas URL
    const myCanvas = req.body.myCanvas;
    var url = myCanvas.toDataURL();


    console.log('inside submit');
    console.log('title: '  + title);
    console.log('comment: ' + comment);
    console.log('lat:  ' + lat);
    console.log('lng:  ' + lng);
    console.log('url: ' + url);

    data.features.push( {
        "id": data.total,
        "title": title,
        "comment": comment,
        "comments": [],
        "vote": 0,
        "nsfw": false,


        "geo": {
            "type": "Feature",

            // TODO: For now use sample external image, later after image upload to server works, use link to local image
            "link": url,

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
    data.total = data.total + 1;
    console.log(data);

    fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('New graffiti is saved');
    });

    res.redirect('/home');

});

module.exports = router;
