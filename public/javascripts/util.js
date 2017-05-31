/**
 * Created by atomic on 5/12/17.
 */

var data;
var voteval = new Array(); //stores what user has voted on a post
                            // TODO: track it persistently across session later

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
 * used in home.hbs, profile.hbs, and map.hbs
 */
function vote(id, value, callback) {
    console.log("value: ", value + ", id: ", id);
    // TODO: use dictionary if possible
    while(id > voteval.length){ //increases size of array if id is too big
        voteval.push(0); //0 means haven't voted at all yet; 1 is upvoted; -1 is downvoted
    }
    if(!voteval[id] || voteval[id] != value){ //updates only if different

        /* Updates button colors
        if(value == 1){
            document.getElementById("upbtn").style.color = "#110275";
        }
        else{
            document.getElementById("downbtn").style.color = "#110275";
        }
        */

        var origVal = value;
        if(voteval[id]){ //changed vote to opposite
            value += value;

            /* Updates button colors
            if(value == 1){
                document.getElementById("downbtn").style.color = "#C8C8C8";
            }
            else{
                document.getElementById("upbtn").style.color = "#C8C8C8";
            }
            */

        }
        $.post('/post/vote', {'id': id, 'value': value}, callback);
        voteval[id] = origVal;
    }
    else if(voteval[id] && voteval[id] == value){ //undo vote

        /* Updates button colors back to original
        if(value == 1){
            document.getElementById("upbtn").style.color = "#C8C8C8";
        }
        else{
            document.getElementById("downbtn").style.color = "#C8C8C8";
        }
        */

        value = -value;
        $.post('/post/vote', {'id': id, 'value': value}, callback);
        voteval[id] = 0;
    }
}

function deletePost(id, callback) {
    $.post('/post/delete', {'id': id}, callback);
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
