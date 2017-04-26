var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../data.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post', { title: 'Post Graffiti' });
});

router.get('/submit', function (req, res, next) {

    var title = req.query.title;
    var comment = req.query.comment;
    var latlng = req.query.latlng;

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
                "coordinates" : latlng
            }
        }
    });

    fs.writeFile('../data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('New graffiti is saved');
    });

    res.redirect('Home');

});

module.exports = router;
