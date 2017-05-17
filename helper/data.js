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
    },

    /**
     * function to get the user from clients.json
     *
     * @param username
     * @returns undefined if user does not exists, else return the user accounts
     */
    getUser: function (username) {
        let users = require('../client.json').accounts;
        return users.find(acc => acc.username === username);
    },

    createUser: function (username, password) {
        let client = require('../client.json');
        client.accounts.push( { "username": username, "password": password, posts: [] });

        fs.writeFile('client.json', JSON.stringify(client, null, '\t'), function (err) {
            if (err) throw err;
            console.log('--- new user added');
        });
    }
};
