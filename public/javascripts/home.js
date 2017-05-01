/**
 * Created by atomic on 5/1/17.
 */

var id_selected = 0;

$(document).ready(function (event) {

    $(".post").each(setupPosts);

    // Get the button that opens the modal

    const btnComments = $(".btn-comments");
    btnComments.each(setupCommentModal);


// Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

});

function setupPosts(i, obj) {
    var coor = $(this).data('coordinate');
    coor = coor.split(',').map(parseFloat).reverse();
    console.log(coor);

    var postmap = $('<div>', {
        "class": "map",
        "id": "map" + i,
        "style": "height: 200px; width: auto;"
    });
    $(this).append(postmap);

    let map = L.map('map' + i, {
            center: coor, /** just in case gps does not work */
            zoom: 15,
            doubleClickZoom: false
        }
    );
    L.marker(coor).addTo(map);

//        Mapbox Tile as a backup
//        L.tileLayer('https://api.mapbox.com/styles/v1/twsalim/cj201s4ev001q2soz3o0zvcsg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHdzYWxpbSIsImEiOiJjajFoNGpsd2owMGI0MzNvaGNxeWN5ZTJ3In0.X-Mp23YcMlZIfXak5KzKvg').addTo(map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

/**
 * setupCommentModal
 *  a function to set up the pop-up modal after user click comment button
 *
 * @param index:    index for each comment button in each post
 *
 */
function setupCommentModal(index) {

    const modal = document.getElementById('myModal');
    let newComment = $("#modal-cmt-add");
    let modalBody = $(".modal-body");
    let commentShown = false;
    var $comments = $(this).closest('div.post').find('.comments');
    id_selected = $(this).data('id');


    $(this).on("click", function () {
        modal.style.display = "block";
        console.log($comments.html());
        modalBody.html($comments.html());
    });

    $(".modal-btn-add").each(function () {
        $(this).off().on("click", function () {
            console.log(commentShown);
            if (commentShown) {

                $.post('/home/add_comments', { 'id': id_selected, 'comment': newComment.val() }, function (req, res) {
                    alert('Comment Added!');
                    // $comments.append($('<p class="list-group-item">' + newComment.val() + '</p>'));
                });
                // newComment.hide();
                // modal.style.display = "none";
                // commentShown = false;
            } else {
                commentShown = true;
                newComment.show();
            }
        })
    });
    $(".modal-btn-close").each(function () {
        $(this).on("click", function () {
            newComment.hide();
            modal.style.display = "none";
        })
    });
}

