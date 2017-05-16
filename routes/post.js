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


    console.log('inside submit');
    console.log('title: '  + title);
    console.log('description: ' + description);
    console.log('lat:  ' + lat);
    console.log('lng:  ' + lng);
    // console.log('url: ' + url);

    data.features.push( {
        "id": data.total,
        "title": title,
        "user": "me",
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
    data.total = data.total + 1;

    fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('New graffiti is saved');
    });

    res.redirect('/home');
});


module.exports = router;
