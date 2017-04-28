const LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'images/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});

const greenIcon = new LeafIcon({iconUrl: 'images/leaf-green.png'}),
    redIcon = new LeafIcon({iconUrl: 'images/leaf-red.png'}),
    orangeIcon = new LeafIcon({iconUrl: 'images/leaf-orange.png'});

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

