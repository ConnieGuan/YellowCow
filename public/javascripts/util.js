/**
 * Created by atomic on 5/12/17.
 */

var data;

$(document).ready(function (event) {
    console.log('inside util.js');
});

/**
 * callback function for when vote button is clicked,
 * corresponding post should update votes by value
 *
 * @param id:    id of the post
 * @param value: -1,1 depending on whether its upvote or downvote
 *
 * used in home.hbs, and map.hbs
 */
function vote(id, value, callback) {
    // console.log("value: ", value + ", id: ", id);
    $.post('/update/vote', {'id': id, 'value': value}, callback);
}



/**
 * Global Configurations
 * these are data that may be used accross different sites
 * data that are exclusive to one site should not be included here
 *
 */
var coor_ucsd = [32.88044, -117.23758];
var icon_you = L.icon({
    iconUrl: 'images/youstar.png',
    iconSize: [50, 50]
});
var icon_pin = L.icon({
    iconUrl: 'images/pin.png',
    iconSize: [45, 45]
});
var icon_unexplored = L.icon({
    iconUrl: 'images/unexplored.png',
    iconSize: [45, 45]
});
var icon_hot = L.icon({
    iconUrl: 'images/popular.png',
    iconSize: [45, 45]
});
