var map;

// Helper variabls to display the indeterminate loader on top of the screen
var oldTileCoordinate;
var TILE_SIZE = 256;
var mapLoaded = false;
var dataLoaded = false;

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
function initMap() {
    return new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 28.6139, lng: 77.2090},
        mapTypeControl: false,
        streetViewControl: false
    });

}

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
function userGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // Using global variable here
            map.setCenter(pos);
            map.setZoom(12);
        }, function () {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }
}

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
function handleLocationError(browserHasGeolocation) {
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(browserHasGeolocation ?
        'Is the Location Service enabled?' :
        'Your browser doesn\'t support geolocation.', 2000); // last number is the duration of the toast
}

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
function project(latLng) {
    var siny = Math.sin(latLng.lat() * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
function getNewTileCoordinate() {
    var currentBounds = map.getBounds();
    var currentCenterLatLng = currentBounds.getCenter();
    var scale = 1 << map.getZoom();
    var worldCoordinate = project(currentCenterLatLng);
    return new google.maps.Point(
        Math.floor(worldCoordinate.x * scale / TILE_SIZE),
        Math.floor(worldCoordinate.y * scale / TILE_SIZE));
}

// Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
//noinspection JSUnusedGlobalSymbols
function initAutocomplete() {

    map = initMap();

    google.maps.event.addListener(map, 'bounds_changed', function () {
        var newTileCoordinate = getNewTileCoordinate();
        if (typeof oldTileCoordinate != 'undefined') {
            if ((Math.abs(newTileCoordinate.x - oldTileCoordinate.x) >= 2) || (Math.abs(newTileCoordinate.y - oldTileCoordinate.y) >= 2)) {
                mapLoaded = false;
                $('.activityIndicator').fadeIn(200);
            }
        }
    });

    google.maps.event.addListener(map, 'tilesloaded', function () {
        oldTileCoordinate = getNewTileCoordinate();
        mapLoaded = true;
        if (mapLoaded && dataLoaded) {
            $('.activityIndicator').fadeOut(200);
        }
    });

    // Load pins on map idle
    google.maps.event.addListener(map, 'idle', function () {
        queryData();
    });

    // HTML5 geolocation
    userGeolocation();

    // Create the search box and link it to the UI element.
    var input;
    input = document.getElementById('search-input');
    // var searchDiv = document.getElementById('search-div');
    //noinspection JSCheckFunctionSignatures
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchDiv);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        //
        // // Clear out the old markers.
        // markers.forEach(function (marker) {
        //     marker.setMap(null);
        // });
        // markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            //     var icon = {
            //         url: place.icon,
            //         size: new google.maps.Size(71, 71),
            //         origin: new google.maps.Point(0, 0),
            //         anchor: new google.maps.Point(17, 34),
            //         scaledSize: new google.maps.Size(25, 25)
            //     };
            //
            //     // Create a marker for each place.
            //     markers.push(new google.maps.Marker({
            //         map: map,
            //         icon: icon,
            //         title: place.name,
            //         position: place.geometry.location
            //     }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

// Types of pins
var INVALID_PIN = 0;
var MULTI_PIN = 1;
var CRIME_PIN = 2;
var LEGISLATOR_PIN = 3;
var WIKI_PIN = 4;

// Identify the type of a pin
function typeOfMarker(pin) {

    //noinspection JSUnresolvedVariable
    if (pin.crime_list.length == 1 && pin.legislator_list.length == 0 && pin.wiki_info_list.length == 0) {

        return CRIME_PIN;

    } else { //noinspection JSUnresolvedVariable
        if (pin.crime_list.length == 0 && pin.legislator_list.length == 1 && pin.wiki_info_list.length == 0) {

            return LEGISLATOR_PIN;

        } else { //noinspection JSUnresolvedVariable
            if (pin.crime_list.length == 0 && pin.legislator_list.length == 0 && pin.wiki_info_list.length > 0) {

                return WIKI_PIN;

            } else { //noinspection JSUnresolvedVariable
                if (pin.crime_list.length == 0 && pin.legislator_list.length == 0 && pin.wiki_info_list.length == 0) {

                    return INVALID_PIN

                } else {

                    return MULTI_PIN;

                }
            }
        }
    }

}

// Checks if a marker is present in the new input
// function isMarkerPresent(pinList, marker) {
//     pinList.forEach(function (pin) {
//         if (pin.location.lat == marker.position.lat &&
//             pin.location.lng == marker.position.lng &&
//             typeOfMarker(pin) == markerTypes[markers.indexOf(marker)]) {
//             return true;
//         }
//     });
//
//     return false;
//
// }

// Global array to store all the markers currently marked on `map`.
var markers = [];
// var markerTypes = [];
var infowindow;
var currentlyActiveInfowindowPin;

function infowindowContent(title, body) {
    return '<div>' +
        '<h6 class="firstHeading">' + title + '</h6>' +
        '<div>' +
        '<p>' + body + '</p>' +
        '<p><a onclick="handleMoreDetailsEvent(); void(0);" href="#">More details</a></p>' +
        '</div>' +
        '</div>';
}

function slowlyFadeOut(markerRef) {
    var currentOpacity = 1.0;

    function slowlyFadeOutHelper() {
        currentOpacity -= 0.1;
        markerRef.setOpacity(currentOpacity);
        if (currentOpacity <= 0.1) {
            clearInterval(myInterval);
            markerRef.setMap(null);
        }
    }

    var myInterval = setInterval(function () {
        slowlyFadeOutHelper()
    }, 30);
}

function slowlyFadeIn(markerRef) {
    var currentOpacity = 0.0;

    function slowlyFadeInHelper() {
        currentOpacity += 0.1;
        markerRef.setOpacity(currentOpacity);
        if (currentOpacity >= 0.9) {
            clearInterval(myInterval);
            markerRef.setOpacity(1);
        }
    }

    var myInterval = setInterval(function () {
        slowlyFadeInHelper()
    }, 30);
}

function crimeMoreDetailsHelper(crimeItem, showImage) {
    var appendString;

    //noinspection JSUnresolvedVariable
    appendString = '<div class="card z-depth-0">';
    if (showImage) {
        appendString += '<div class="card-image">' +
            '<img src="' + crimePicture + '">';

        appendString += '<span class="card-title blackBorder">Crime Data</span>';
        appendString += '</div>';
    }

    appendString += '<div class="card-content">';

    //noinspection JSUnresolvedVariable
    if ("type" in crimeItem && crimeItem.type.length > 0) {
        appendString += '<p class="textSemiTransparent">There is a record of ' + crimeItem.type + ' at this location.</p>';
    }

    if ("fir_no" in crimeItem && crimeItem.fir_no.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><i class="fa fa-file-text-o" aria-hidden="true"></i> FIR number ' + crimeItem.fir_no + '</p>';
    }

    if ("timestamp" in crimeItem && crimeItem.timestamp.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><i class="fa fa-calendar" aria-hidden="true"></i> ' + crimeItem.timestamp + '</p>';
    }

    if ("url_link" in crimeItem && crimeItem.url_link.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><a class="specialSidebarLink" href="' + crimeItem.url_link + '">Source of data <i class="fa fa-external-link" aria-hidden="true"></i></a></p>';
    }

    appendString += '</div>' +
        '<hr class="semiTransparentHR"></div>';

    return appendString;
}

// TODO: Remove "&nbsp;" occurrences
function legislatorMoreDetailsHelper(legislatorItem, showImage) {
    var appendString;

    //noinspection JSUnresolvedVariable
    appendString = '<div class="card z-depth-0">';
    if (showImage) {
        appendString += '<div class="card-image">' +
            '<img src="' + sansadPicture + '">';

        appendString += '<span class="card-title blackBorder">Sansad Data</span>';
        appendString += '</div>';
    }

    appendString += '<div class="card-content">';

    if ("party" in legislatorItem && legislatorItem.party.length > 0) {
        appendString += '<p class="textSemiTransparent"><i class="fa fa-users" aria-hidden="true"></i> Party: ' + legislatorItem.party + '</p>';
    }

    if ("first_name" in legislatorItem && legislatorItem.first_name.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;' + legislatorItem.first_name + " ";
    } else {
        appendString += '<p class="textSemiTransparent">Name not available';
    }

    if ("last_name" in legislatorItem && legislatorItem.last_name.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += legislatorItem.last_name + '</p>';
    } else {
        appendString += '</p>';
    }

    if ("no_questions" in legislatorItem && legislatorItem.no_questions.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><i class="fa fa-question" aria-hidden="true"></i>&nbsp;&nbsp;' + legislatorItem.no_questions + ' questions raised in the legislature.</p>';
    }

    appendString += '</div>' +
        '<hr class="semiTransparentHR"></div>';

    return appendString;
}

// TODO: Remove "&nbsp;" occurrences
function wikiMoreDetailsHelper(wikiItem, showImage) {
    var appendString;

    //noinspection JSUnresolvedVariable
    appendString = '<div class="card z-depth-0">';
    if (showImage) {
        appendString += '<div class="card-image">' +
            '<img src="' + wikiPicture + '">';

        appendString += '<span class="card-title blackBorder">Sansad Data</span>';
        appendString += '</div>';
    }

    appendString += '<div class="card-content">';

    if ("title" in wikiItem && wikiItem.title.length > 0) {
        appendString += '<p class="textSemiTransparent"><i class="fa fa-wikipedia-w" aria-hidden="true"></i> ' + wikiItem.title + '</p>';
    }

    if ("info" in wikiItem && wikiItem.info.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;&nbsp;' + wikiItem.info + '</p>';
    }

    if ("link" in wikiItem && wikiItem.link.length > 0) {
        //noinspection JSUnresolvedVariable
        appendString += '<p class="textSemiTransparent"><a class="specialSidebarLink" href="' + wikiItem.link + '">Full article <i class="fa fa-external-link" aria-hidden="true"></i></a></p>';
    }

    appendString += '</div>' +
        '<hr class="semiTransparentHR"></div>';

    return appendString;
}

function multiMoreDetailsHelper(multiItem) {
    var appendString = '';
    var picDisplayedAlready;

    if ("legislator_list" in multiItem && multiItem.legislator_list.length > 0) {
        picDisplayedAlready = false;
        multiItem.legislator_list.forEach(function (legislatorItem) {
            appendString += legislatorMoreDetailsHelper(legislatorItem, !picDisplayedAlready);
            if (!picDisplayedAlready) {
                picDisplayedAlready = true;
            }
        });
    }

    if ("crime_list" in multiItem && multiItem.crime_list.length > 0) {
        picDisplayedAlready = false;
        multiItem.crime_list.forEach(function (crimeItem) {
            appendString += crimeMoreDetailsHelper(crimeItem, !picDisplayedAlready);
            if (!picDisplayedAlready) {
                picDisplayedAlready = true;
            }
        });
    }

    if ("wiki_info_list" in multiItem && multiItem.wiki_info_list.length > 0) {
        picDisplayedAlready = false;
        multiItem.wiki_info_list.forEach(function (wikiItem) {
            appendString += wikiMoreDetailsHelper(wikiItem, !picDisplayedAlready);
            if (!picDisplayedAlready) {
                picDisplayedAlready = true;
            }
        });
    }

    return appendString;
}

function handleMoreDetailsEvent() {
    $('.button-collapse').sideNav('show');
    var navMobileSelector = $('#nav-mobile');
    navMobileSelector.empty();
    var appendString = '<p class="fullWidth"><div class="center-align waves-effect waves-teal btn-flat fullWidth"><i class="fa fa-search-plus" aria-hidden="true"></i> Zoom in to this pin</div></p>';

    switch (typeOfMarker(currentlyActiveInfowindowPin)) {

        case MULTI_PIN:
            //noinspection JSUnresolvedVariable
            var multiItem = currentlyActiveInfowindowPin;
            appendString += multiMoreDetailsHelper(multiItem);
            break;
        case CRIME_PIN:
            //noinspection JSUnresolvedVariable
            var crimeItem = currentlyActiveInfowindowPin.crime_list[0];
            appendString += crimeMoreDetailsHelper(crimeItem, true);
            break;
        case LEGISLATOR_PIN:
            //noinspection JSUnresolvedVariable
            var legislatorItem = currentlyActiveInfowindowPin.legislator_list[0];
            appendString += legislatorMoreDetailsHelper(legislatorItem, true);
            break;
        case WIKI_PIN:
            //noinspection JSUnresolvedVariable
            var wikiItem = currentlyActiveInfowindowPin.wiki_info_list[0];
            appendString += wikiMoreDetailsHelper(wikiItem, true);
            break;
        case INVALID_PIN:
            break;

    }

    appendString += '<p class="fullWidth"><h5 class="fullWidth center-align"><i class="fa fa-map"></i> Map-Annotate</h5></p>';

    navMobileSelector.append(appendString);

    // <div class="card z-depth-0">
    //     <div class="card-image">
    //         <img src="http://materializecss.com/images/sample-1.jpg">
    //         <span class="card-title">Card Title</span>
    //     </div>
    //     <div class="card-content">
    //         <p>I am a very simple card. I am good at containing small bits of information.
    //             I am convenient because I require little markup to use effectively.</p>
    //     </div>
    // </div>

    // console.log(currentlyActiveInfowindowPin);
}

function setNewMarkers(input) {
    /*
     Marks the pins in `input` on the map. Removes previously marked pins.
     param: input: JSON object of `pins` to be marked on map.
     */
    markers.forEach(function (marker) {
        // if (!isMarkerPresent(input.pins, marker)) {
        slowlyFadeOut(marker);
        // marker.setMap(null);
        // }
    });

    infowindow = new google.maps.InfoWindow({
        content: '',
        disableAutoPan: true
    });

    markers = [];

    //noinspection JSUnresolvedVariable
    input.pins.forEach(function (pin) {
        var location = {lat: pin.location.lat, lng: pin.location.lng};
        var iconLink; // See https://sites.google.com/site/gmapsdevelopment/
        var title;
        var body;
        var contentString;

        switch (typeOfMarker(pin)) {

            case MULTI_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal5/icon44.png';
                title = "Multi Pin: Click to see more details";
                body = '';
                contentString = infowindowContent(title, body);
                break;
            case CRIME_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon33.png';
                //noinspection JSUnresolvedVariable
                title = "Crime Type: " + pin.crime_list[0].type;
                body = '';
                contentString = infowindowContent(title, body);
                break;
            case LEGISLATOR_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon53.png';
                //noinspection JSUnresolvedVariable
                title = "Legislator Data: " + pin.legislator_list[0].first_name +
                    " " + pin.legislator_list[0].last_name;
                body = '';
                contentString = infowindowContent(title, body);
                break;
            case WIKI_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon35.png';
                //noinspection JSUnresolvedVariable
                title = "Wikipedia Data: " + pin.wiki_info_list[0].title;
                body = '';
                contentString = infowindowContent(title, body);
                break;
            case INVALID_PIN:
                break;

        }

        var marker;
        //noinspection JSCheckFunctionSignatures
        marker = new google.maps.Marker({
            map: map,
            title: title,
            icon: iconLink,
            position: location,
            opacity: 0.0
            // animation: google.maps.Animation.DROP
        });
        marker.pinRef = pin;
        pin.markerRef = marker;
        slowlyFadeIn(marker);
        marker.addListener('click', function () {
            infowindow.setContent(contentString);
            //noinspection JSCheckFunctionSignatures
            infowindow.open(map, marker);
            currentlyActiveInfowindowPin = marker.pinRef;
            // console.log(currentlyActiveInfowindowPin);
        });
        markers.push(marker);
        // markerTypes.push(typeOfMarker(pin));
    });

}