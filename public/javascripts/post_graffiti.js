var ucsd_coor = [32.88044, -117.23758];
// var map = L.map('map',{
//     center: ucsd_coor,     // at UCSD
//     zoom: 20
// });

var map = L.map('map', {
    center: ucsd_coor,
    zoom: 20,
    doubleClickZoom: false}
    ).locate({setView: true, maxZoom: 16});


L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

map.on('locationfound', onLocationFound);
map.locate({setView: true, maxZoom: 16});
