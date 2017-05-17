/**
 * Library functions that handle all the write operations to data.json
 * Reduce code duplication across routes
 */

var fs = require('fs');

module.exports = {
    updateData: function (newdata) {
        fs.writeFile('data.json', JSON.stringify(newdata, null, '\t'), function (err) {
            if (err) throw err;
            console.log('data updated');
        });
    },
    writeData: this.updateData,
    totalPost: function () {
        let data = require('../data.json');
        return data.features.length;
    }
};
