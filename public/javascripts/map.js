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
         * Given an id of the post, get the post features object
         *
         * @param id
         * @returns {*}
         */
        data.getFeaturesWithId = function (id) {
            console.log('getting feature of id ' + id);
            for(var i in this.features) {
                if (this.features[i].id == id)
                    return this.features[i];
            }
        };

        return res;
    }).done(setupMap);
});

var global_map = {};

var current_popup;  // to be used as reference to update vote number later on
function updateVote(result, status) {
    console.log(result);
    $('p.votes').text(result.voted);                    // update the current display value
    current_popup.find('p.votes').text(result.voted);   // update the saved display value
}

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

    var hiddenpost = new L.LayerGroup();
    var openstreet = L.tileLayer(openstreetUrl, openstreetAttribution);
    var mapbox = L.tileLayer(mapboxUrl);
    var baseMap    = { "OpenStreet": openstreet, "MapBox": mapbox };
    var overlayMap = { "Hidden": hiddenpost };

    var map = L.map('map', {
        zoom: 15,
        doubleClickZoom: false,
        layers: [hiddenpost, openstreet]
    }).locate({setView: true, maxZoom: 16});

    global_map = map;

    // NOTE: uncomment below to choose map tile
    // L.control.layers(baseMap, overlayMap).addTo(map);

    var customOptions = {
        maxWidth: "300",
        className: "custom"
    };

    var radius_circle = null;       // global to keep track which circle is opened
    var btnVote = $('<button type="button" class="btn btn-primary btn-lg btn-vote"/></button>').text('Vote');
    var chosen_id = null;


    /**
     * Call back function used on each graffiti post
     */
    function setupFeature(feature, layer) {
        var id = feature.id;
        var votes = feature.votes;

        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            imgPop = $(`<img class="popup post-content graffiti img-rounded img-responsive" src="${feature.link}" data-id=${feature.id}>`);


            /*
            var grafPopup = $("<div>").addClass('popup-inner')
                .append( $("h3").html( feature.properties.popupContent + "</br>") ).append( imgPop );
            var leftPopup = $("<div>").addClass('popup-inner')
                .append( "<p style='font-weight: 100;'>Description: " + feature.properties.popupContent + "</p>" );
            var rightPopup = $("<div>")
                .append( "<a id='upbtn' class='btn fa fa-caret-up fa-2x' style='color: #C8C8C8;'' onclick='vote(chosen_id, 1, updateVote)'></a>" )
                .append( "<p class='votes' style='text-align: center; line-height: 100%;'>" + feature.votes + " votes</p>" )
                .append( "<a id='downbtn' class='btn fa fa-caret-down fa-2x' style='color: #C8C8C8;'' onclick='vote(chosen_id, -1, updateVote)'></a>" );
            */




            var customPopup = $("<div>").addClass('popup-inner');
            if (parseInt(200 + 10.0*(votes)) >= 1000){
                customPopup.append("<h5>Wow! This post is really popular!</h5>");
            }


            customPopup .append( $("h3")
                        .html( feature.properties.popupContent + "<br>") )
                        .append( imgPop )
                        .append( "<br><br><p style='font-weight: 100;'><b>Description: </b>" + feature.properties.popupContent + "</p>" )
                        .append( `<div class="modal-votes">
                                    <a id="upbtn" class="btn fa fa-caret-up fa-2x" style="color: #C8C8C8;" onclick="vote(${id}, 1, updateVote)"></a>
                                    <p class="votes" style="text-align: center; font-weight: bold; line-height: 100%;">${ votes }</p>
                                    <a id="downbtn" class="btn fa fa-caret-down fa-2x" style="color: #C8C8C8;" onclick="vote(${id}, -1, updateVote)"></a>
                            </div>`);


            // layer.bindPopup( customPopup.prop('outerHTML'), customOptions);

            layer.on('click', function (e) {
                current_popup = customPopup;
                chosen_id = feature.id;
                if (radius_circle) { map.removeLayer(radius_circle); }
                var post = data.getFeaturesWithId(feature.id);

                console.log('actual votes value: ' + post.votes);

                bootbox.alert({
                    size: 'large',
                    title: feature.properties.name,
                    message: customPopup.html(),
                    backdrop: true
                });
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
    function setupHiddenFeature(feature, layer) {
        layer.on('click', function (e) {
            if (radius_circle) { hiddenpost.removeLayer(radius_circle); }
            var customPopup = $("<div>").addClass('popup-inner')
                .append( "<h3 class='popup-votes'>You must travel within this radius to view this pintura.</h3>" );

            bootbox.alert({
                    size: 'large',
                    title: 'Close',
                    message: customPopup.html(),
                    buttons: {
                        ok: {
                            label: 'Close',
                            className: 'btn-danger'
                        }
                    },
                    callback: function (result) { },
                    backdrop: true
                });



            radius_circle = L.circle( e.latlng, { radius: feature.radius, color: 'gray'}).addTo(hiddenpost);
        }).on('popupclose', function (e) {
            hiddenpost.removeLayer(radius_circle);
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
        var mylocation = L.marker(e.latlng, {icon: icon_you}).addTo(map); //.bindPopup("<h4>You are here</h4>");

        mylocation.on('click', function (e) {
            var customPopup = $("<div>").addClass('popup-inner')
                .append( "<h3 class='popup-votes'>Would you like to post a pintura at your current location?</h3>" );

            bootbox.confirm({
                    size: 'large',
                    title: 'Your Location',
                    message: customPopup.html(),
                    buttons: {
                        confirm: {
                            label: 'Post',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'Close',
                            className: 'btn-danger'
                        }
                    },
                    callback: function (result) {
                        if (result) {
                            document.location.href ="/post";
                        }
                    },
                    backdrop: true
                });
        }).on('popupclose', function (e) { });

        //L.circle(e.latlng, radius).addTo(map); //this is kinda pointless right?
        setupFeatures();

        console.log('post hidden: ' + post_hidden);
    }

    /**
     * Fires when GPS fail to locate, or user does not allow to detect location
     * @param e
     */
    function onLocationError(e) {
        bootbox.alert({
            message: 'Location cannot be found because of GPS error. Will center around UCSD.',
            backdrop: true
        });
        current_pos = new L.LatLng( coor_ucsd[0], coor_ucsd[1]); // ( coor_ucsd.slice().reverse() );
        console.log(current_pos);
        var mylocation = L.marker(current_pos, {icon: icon_you}).addTo(map); //.bindPopup("<h4>Default location</h4>");

        mylocation.on('click', function (e) {
            var customPopup = $("<div>").addClass('popup-inner')
                .append( "<h3 class='popup-votes'>You are set at the default location.</h3>" );

            bootbox.alert({
                size: 'large',
                title: 'Default Location',
                message: customPopup.html(),
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) { },
                backdrop: true
            });
        }).on('popupclose', function (e) { });

        var radius = e.accuracy / 2;
        map.panTo(new L.LatLng(coor_ucsd[0], coor_ucsd[1]));
        map.setView( coor_ucsd, 15);
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
                    onEachFeature: setupFeature
                }).addTo(map);
            } else {
                // add custom markers for unexplored graffiti area
                L.geoJSON(features[i].geo, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: icon_unexplored}); //.bindPopup("<h4>You must travel within this radius to view this pintura.</h4>");
                    },
                    onEachFeature: setupHiddenFeature
                }).addTo(hiddenpost);
                post_hidden++;
            }
        }
    }

    var hidden_shown = true;

    /**
     * Callbacks for the GPS detection events
     */
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('popupopen', function (e) {
    });
    map.on('zoomend', function (e) {
        if (this.getZoom() <= 10) {
            if (hidden_shown) {
                hidden_shown = false;
                map.removeLayer(hiddenpost);
            }
        } else {
            if (!hidden_shown) {
                hidden_shown = true;
                map.addLayer(hiddenpost);
            }
        }
    });


//    useful to add new sample coordinate data later
    map.on('click', function(e) {
        console.log(e.latlng.lng + ',' + e.latlng.lat);
    });
}

