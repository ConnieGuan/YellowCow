/**
 * Created by atomic on 4/24/17.
 */

var ucsd_coor = [32.88044, -117.23758];
console.log(data); /** Ask TA how to get this data rendered from hbs **/

var map = L.map('map', {
        center: ucsd_coor,  /** just in case gps does not work */
        zoom: 20,
    doubleClickZoom: false}
).locate({setView: true, maxZoom: 16});

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker = L.marker(ucsd_coor).addTo(map);
// var polygon = L.polygon([
//     [32.882, -0.08],
//     [32.822, -0.06],
//     [32.892, -0.047]
// ]).addTo(map);
//
// var polygon = L.polygon([
//     [32.88038,-117.23632],
//     [32.88070, -117.23685],
//     [32.88092, -117.23626]
// ]).addTo(map);

// var circle = L.circle(ucsd_coor, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 70
// }).addTo(map);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");

// var popup = L.popup()
//     .setLatLng([32.88070, -117.23685])
//     .setContent("I am a standalone popup.")
//     .openOn(map);


var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'images/leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

var greenIcon = new LeafIcon({iconUrl: 'images/leaf-green.png'}),
    redIcon = new LeafIcon({iconUrl: 'images/leaf-red.png'}),
    orangeIcon = new LeafIcon({iconUrl: 'images/leaf-orange.png'});

//    var customPopup = "Mozilla Toronto Offices<br/>" +
//        "<img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='350px'/>";
//    var imgSrc = 'http://joshuafrazier.info/images/maptime.gif';
var imgSrc = 'http://inthesetimes.com/images/articles/trump_flicker_face_yess.jpg';
//    var cusImg = $("p").text('sadfadsfasd').append('</br>').$("img").attr('src', imgSrc);

var imgPop = $('<img class="popup" src="'+imgSrc+'" />');

var btnUpVote = $('<input type="button" value="Upvote"/>');
var btnDnVote = $('<input type="button" value="Downvote"/>');
var customPopup = $("<div></div>").html( "asdasdsadas</br>asdsafas" )
    .append( imgPop )
    .append(btnUpVote)
    .append(btnDnVote);
//    var customPopup = document.createElement("img").attr('src', imgSrc);

var customOptions = {
    'maxWidth': '500',
    'className' : 'custom'
};

// function onMapClick(e) {
//     console.log('adasdas');
//     console.log(customPopup.html());
//     L.marker([e.latlng.lat, e.latlng.lng], {icon: greenIcon}).bindPopup(customPopup.html(), customOptions)
//         .addTo(map);
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
// map.on('click', onMapClick);

