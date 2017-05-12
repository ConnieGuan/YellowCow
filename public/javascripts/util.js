/**
 * Created by atomic on 5/12/17.
 */

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
    console.log("value: ", value + ", id: ", id);
    $.post('/update/vote', {'id': id, 'value': value}, callback);
}

