/**
 * client side scripts for map page
 */
$(document).ready(function (event) {


    /**
     * set up data from server before showing the map view
     */
    // var data;
    // $.get('/api/data', {}, function (res, req) {
    //     data = res;
    //     return res;
    // }).done(setupMap);
    setupSimpleMap();
});

/**
 * For debug in mobile web
 */
function setupSimpleMap() {
    var ucsd_coor = [32.87822, -117.24152];

    var map = L.map('map', {
        center: ucsd_coor,
        zoom: 15,
        doubleClickZoom: false
    }).locate({setView: true, maxZoom: 16});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

