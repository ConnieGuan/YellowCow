$(document).ready(function (event) {
    // http://stackoverflow.com/questions/34048093/submit-canvas-data-in-an-html-form
    var canvas = document.getElementById('myCanvas');

    $("#post_graffiti_form").submit( function(event) {
        event.preventDefault();

        /**
         * Using indirect post method to handle image upload separately
         * @type {*}
         */
        var $form = $(this);
        var dataURL = canvas.toDataURL('image/png');
        /* stop form from submitting (handle manually) */
        var canvasUpload = "/post/submit_canvas";

        $.ajax({
            type: "POST",
            url: canvasUpload,
            data: {
                testSend: 'stuff',
                imgBase64: dataURL
            }
        }).done(function (data) { // data is undefined, not sending anything back
            console.log('image saved successfully');
            $.post( $form.attr('action'), $form.serialize() + '&lat=' + coor[1] + '&lng=' + coor[0],
                function (data) {
                    window.location.href = '/home';
                });
        }).fail(function (jqXHR, exception) {
            // Our error logic here
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        });


    });
    // $(document).on('submit', '#post_graffiti_form', function(event) {
    // });
});


var coor = [32.88044, -117.23758]; // temporary

var map = L.map('map', {
    // center: ucsd_coor,
        zoom: 20,
        zoomControl: false,
        attributionControl: false,
        boxZoom: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false
}).locate({setView: true, maxZoom: 16});

var new_marker = L.icon({
    iconUrl: 'images/marker-new.png',
    iconSize: [45, 45]
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onLocationFound(e) {
    coor = [e.latlng.lng, e.latlng.lat];

    var radius = e.accuracy / 2;

    L.marker(e.latlng, { icon: new_marker }).addTo(map);

    console.log('location: e.latlng');
}

function onLocationError(e) {
    alert('Location cannot be found because of GPS error. Will center around UCSD');
    map.panTo( ucsd_coor, 15);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
