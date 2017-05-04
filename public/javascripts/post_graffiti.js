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
            $.post( $form.attr('action'), $form.serialize(), function (data) {
                window.location.href = '/home';
            });
        });


    });
    // $(document).on('submit', '#post_graffiti_form', function(event) {
    // });
});


var ucsd_coor = [32.88044, -117.23758];

var map = L.map('map', {
    // center: ucsd_coor,
    zoom: 20,
    doubleClickZoom: false}
    ).locate({setView: true, maxZoom: 16});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("Your graffiti will be posted within " + radius + " meters from this point").openPopup();

    console.log(e.latlng);
    $("#lat").val(e.latlng.lat);
    $("#lng").val(e.latlng.lng);

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert('Location cannot be found because of GPS error. Will center around UCSD');
    map.panTo( ucsd_coor, 15);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
