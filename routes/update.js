var express = require('express');
var router = express.Router();
var data = require('../data.json');
var fs = require('fs');

/* GET home page. */
router.post('/vote', function(req, res, next) {
    let value = req.body.value,
        id = req.body.id;

    console.log('inside vote: id=' + id + ', val:' + value);

    var post = data.features.find(x => x.id == id );
    post.votes = parseInt(post.votes) + parseInt(value);

    fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
        if (err) throw err;
        console.log('new post vote: ' + post.id);
    });
    console.log(`${post.id} , votes: ${post.votes}`);
    res.send({'id': post.id, voted: post.votes});
});

module.exports = router;
