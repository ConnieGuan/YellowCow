var ucsd_coor = [-117.23758, 32.88044];

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
    map.panTo(new L.LatLng(ucsd_coor[0], ucsd_coor[1]));
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
