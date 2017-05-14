/**
 * Created by atomic on 5/1/17.
 */

var id_selected = 0;

$(document).ready(function (event) {

    $(".row").each(setupPosts);

    // Get the button that opens the modal

    const modal = document.getElementById('myModal');
    var modalBody = $(".modal-body");
    var selected_id = 0;

    $(".btn-comments").each( function (index) {
        var $comments = $(this).closest('div.row').find('.comments');  // find the closest comments div

        $(this).on("click", function () {
            selected_id  = $comments.data('id');        // updating the selected_id for later use
            modal.style.display = "block";
            console.log($comments.html());
            console.log(selected_id);
            modalBody.html($comments.html());
        });
    });

    var commentShown = false;

    var newComment = $("#modal-cmt-add");
    $("#modal-btn-close").each(function () {
        $(this).on("click", function () {
            commentShown = false;                   // redundant if page is going to be reloaded anyway
            newComment.hide();
            modal.style.display = "none";
            location.reload();                      // TODO: this is temporary solution, later on use some kind of object representation to store different posts's data (Angular?)
        })
    });
    $("#modal-btn-add").each(function () {

        console.log('setup, id: ' + selected_id);

        $(this).off().on("click", function () {
            console.log('comment: ' + commentShown);
            console.log('id: ' + selected_id);

            if (commentShown) {

                $.post('/home/add_comments', { 'id': selected_id, 'comment': newComment.val() }, function (req, res) {
                    // alert('Comment Added!');
                    modalBody.first().append($('<p class="list-group-item">' + newComment.val() + '</p>'));
                    newComment.val("");
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



// Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];


/*********************************************************/
// When the user clicks on <span> (x), close the modal
    /*BUGGY---- TO-DO if user clicks (x) then the comments down refresh like how it does when the user clicks the "CLOSE" button */

    // span.onclick = function() {
    //     modal.style.display = "none";
    // };
/*********************************************************/

});

/**
 * Function that applies to each post
 * @param i     index of the post on home page
 * @param obj
 */
function setupPosts(i, obj) {
    var coor = $(this).data('coordinate');
    coor = coor.split(',').map(parseFloat).reverse();

    console.log("indside");
    console.log(i);

    // var postmap = $('<div>', {
    //     "class": "map",
    //     "id": "map" + i,
    //     "style": "height: 200px; width: auto;"
    // });
    var postmap = '<div class="map" id='+'"map'+i+'" style="height: 200px; width: auto;"></div><hr>';
    $(this).append(postmap);

    var map = L.map('map' + i, {
            center: coor,
            zoom: 15,
            zoomControl: false,
            attributionControl: false,
            boxZoom: false,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        }
    );
    L.marker(coor).addTo(map);

//        Mapbox Tile as a backup
//        L.tileLayer('https://api.mapbox.com/styles/v1/twsalim/cj201s4ev001q2soz3o0zvcsg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHdzYWxpbSIsImEiOiJjajFoNGpsd2owMGI0MzNvaGNxeWN5ZTJ3In0.X-Mp23YcMlZIfXak5KzKvg').addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

