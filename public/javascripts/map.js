/**
 * client side scripts for map page
 */
$(document).ready(function (event) {


    /**
     * set up data from server before showing the map view
     */
    var data;

    $.get('/api/data', {}, function (res, req) {
        data = res;

        /**
         * add function to data
         *
         * @param id
         * @returns {*}
         */
        data.getFeaturesWithId = function (id) {
            console.log('getting feature of id ' + id);
            console.log(this);
            for(var i in this.features) {
                if (this.features[i].id == id)
                    return this.features[i];
            }
        };

        return res;
    }).done(setupMap);

});

/**
 * method to set up the map interfaces
 * (fired after ajax request called for data)
 *
 * @param data: the data from server
 */
function setupMap(data) {
    var features = data.features;
    var current_pos = null;
    var post_hidden = 0;

    var map = L.map('map', {
        zoom: 15,
        doubleClickZoom: false
    }).locate({setView: true, maxZoom: 16});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    var customOptions = {
        maxWidth: "300",
        className: "custom"
    };

    var radius_circle = null;       // global to keep track which circle is opened
    var btnVote = $('<button type="button" class="btn btn-primary btn-lg btn-vote"/></button>').text('Vote');


    /**
     * Call back function used on each graffiti post
     */
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            imgPop = $(`<img class="popup" src="${feature.link}" data-id=${feature.id}>`);
            var customPopup = $("<div>").addClass('container popup-inner')
                .append( "<h1>" + feature.properties.name + "</h1>" )
                .append( "<h3 class='popup-votes'>Votes: " + feature.votes + "</h3>" );
                if (parseInt(200 + 10.0*(feature.votes)) >= 1000){
                    customPopup.append("<h5>Wow! This post is really popular!</h5>");
                }
                customPopup.append( $("h3").html( feature.properties.popupContent + "</br>") )
                .append( imgPop )
                .append(btnVote);


            layer.bindPopup( customPopup.prop('outerHTML'), customOptions);
            layer.on('click', function (e) {
                if (radius_circle) { map.removeLayer(radius_circle); }

                var post = data.getFeaturesWithId(feature.id);
                console.log('get feature id ' + feature.id);
                console.log(post);
                console.log('actual votes value: ' + post.votes);
                // TODO: Fix bug with popup value wont update after closed
                // customPopup.find(".popup-votes").html( post.votes );
                // console.log(customPopup.html());
                // layer.bindPopup( customPopup.prop('outerHTML'), customOptions); // gotta update newest layout after vote

                radius_circle = L.circle( e.latlng, feature.radius).addTo(map);
            }).on('popupclose', function (e) {
                map.removeLayer(radius_circle);
            });
        }
    }

    /**
     * For each post that are beyond their radius coverage, apply some unique styling and options to their marker
     * @param feature
     * @param layer
     */
    function onEachHiddenFeature(feature, layer) {
        layer.on('click', function (e) {
            if (radius_circle) { map.removeLayer(radius_circle); }
            radius_circle = L.circle( e.latlng, { radius: feature.radius, color: 'gray'}).addTo(map);
        }).on('popupclose', function (e) {
            map.removeLayer(radius_circle);
        });
    }

    /**
     * Fires when GPS detected current location
     * @param e
     */
    function onLocationFound(e) {
        current_pos = e.latlng;
        var radius = e.accuracy / 2;
//        L.marker(e.latlng, {icon: icon_you}).addTo(map).bindPopup("<h4>You are here</h4>").openPopup(); // open pop up kinda annoying <-- I agree
        L.marker(e.latlng, {icon: icon_you}).addTo(map).bindPopup("<h4>You are here</h4>");
        //L.circle(e.latlng, radius).addTo(map); //this is kinda pointless right?
        setupFeatures();

        console.log('post hidden: ' + post_hidden);
    }
    /**
     * Fires when GPS fail to locate, or user does not allow to detect location
     * @param e
     */
    function onLocationError(e) {
        alert('Location cannot be found because of GPS error. Will center around UCSD.');
        map.panTo(new L.LatLng(coor_ucsd[0], coor_ucsd[1]));
        map.setView( coor_ucsd, 15);
        current_pos = new L.LatLng( coor_ucsd.slice().reverse() );
        setupFeatures();    // show markers around UCSD if no GPS detected
    }

    /**
     * function to set up all graffiti pop-up contents, radius, show or not show
     */
    function setupFeatures() {
        /** Set callbacks for each graffiti post on the map */
        for(var i in features) {
            var dist = current_pos.distanceTo(features[i].geo.geometry.coordinates.slice().reverse());
            var rad  = Math.abs(parseInt(200 + 10.0*(features[i].votes)));


            features[i].geo.dist = parseInt(dist);
            features[i].geo.radius = rad;        // store on global data variable for easier access in callback function
            features[i].geo.id = features[i].id;        // a workaroud for popup events later on
            features[i].geo.votes = features[i].votes;



            if (dist <= rad) {
                L.geoJSON(features[i].geo, {
                    pointToLayer: function (feature, latlng) {
                        if (rad >= 1000) {
                            return L.marker(latlng, {icon: icon_hot});
                        } else { return L.marker(latlng, {icon: icon_pin}); }
                    },
                    onEachFeature: onEachFeature
                }).addTo(map);
            } else {
                // add custum markers for unexplored graffiti area
                L.geoJSON(features[i].geo, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: icon_unexplored}).bindPopup("<h4>You must travel within this radius to view this pintura.</h4>");
                    },
                    onEachFeature: onEachHiddenFeature
                }).addTo(map);
                post_hidden++;
            }
        }
    }

    /**
     * function to update votes data and html elements after clicked
     *
     * @param id
     * @param votes
     */
    function updateVote(id, votes) {
        console.log('inside updateVote');
        var post = data.getFeaturesWithId(id);

        post.votes = parseInt(votes);                   // update the data(client side)
        $(".popup-votes").text(post.votes);
    }

    /**
     * Callbacks for the GPS detection events
     */
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('popupopen', function (e) {
        $(" button.btn-vote").click( function () {
            console.log('id: ' + $(".popup").data('id'));
            vote( $(".popup").data('id'), 1,
                function (res, req) {
                    console.log('id voted: ' + res.id + ', val: ' + res.voted);
                    updateVote(res.id, parseInt(res.voted));
                });
        });
    });


//    useful to add new sample coordinate data later
    map.on('click', function(e) {
        console.log(e.latlng.lng + ',' + e.latlng.lat);
    });
}
