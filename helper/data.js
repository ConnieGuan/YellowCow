/**
 * Created by atomic on 5/16/17.
 */

var fs = require('fs');
var data = require('../data.json');

module.exports = {
    updateData: function (newdata) {
        console.log('inside update data hlper function');

        fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
            if (err) throw err;
            console.log('New graffiti is saved');
        });
    }
};
