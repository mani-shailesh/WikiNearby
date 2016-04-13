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
    var input = document.getElementById('search-input');
    // var searchDiv = document.getElementById('search-div');
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

    if (pin.crime_list.length > 0 && pin.legislator_list.length == 0 && pin.wiki_info_list.length == 0) {

        return CRIME_PIN;

    } else if (pin.crime_list.length == 0 && pin.legislator_list.length > 0 && pin.wiki_info_list.length == 0) {

        return LEGISLATOR_PIN;

    } else if (pin.crime_list.length == 0 && pin.legislator_list.length == 0 && pin.wiki_info_list.length > 0) {

        return WIKI_PIN;

    } else if (pin.crime_list.length == 0 && pin.legislator_list.length == 0 && pin.wiki_info_list.length == 0) {

        return INVALID_PIN

    } else {

        return MULTI_PIN;

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

function infowindowContent(title) {
    return '<div>' +
        '<h6 class="firstHeading">' + title + '</h6>' +
        '<div>' +
        '<p>' + title + '</p>' +
        '<p><a onclick="handleMoreDetailsEvent(); void(0);" href="#">More details</a></p>' +
        '</div>' +
        '</div>';
}

function handleMoreDetailsEvent() {
    $('.button-collapse').sideNav('show');
    // console.log(currentlyActiveInfowindowPin);
}

function setNewMarkers(input) {
    /*
     Marks the pins in `input` on the map. Removes previously marked pins.
     param: input: JSON object of `pins` to be marked on map.
     */
    markers.forEach(function (marker) {
        // if (!isMarkerPresent(input.pins, marker)) {
        marker.setMap(null);
        // }
    });

    infowindow = new google.maps.InfoWindow({
        content: '',
        disableAutoPan: true
    });

    markers = [];

    input.pins.forEach(function (pin) {
        var location = {lat: pin.location.lat, lng: pin.location.lng};
        var iconLink; // See https://sites.google.com/site/gmapsdevelopment/
        var title;
        var contentString;

        switch (typeOfMarker(pin)) {

            case MULTI_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal5/icon44.png';
                title = "Multi Pin: Click to see more details";
                contentString = infowindowContent(title);
                break;
            case CRIME_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon33.png';
                title = "Crime Data: " + pin.crime_list[0].type;
                contentString = infowindowContent(title);
                break;
            case LEGISLATOR_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon53.png';
                title = "Legislator Data: " + pin.legislator_list[0].title;
                contentString = infowindowContent(title);
                break;
            case WIKI_PIN:
                iconLink = 'http://maps.google.com/mapfiles/kml/pal3/icon35.png';
                title = "Wikipedia Data: " + pin.wiki_info_list[0].title;
                contentString = infowindowContent(title);
                break;
            case INVALID_PIN:
                break;

        }

        var marker = new google.maps.Marker({
            map: map,
            title: title,
            icon: iconLink,
            position: location
            // animation: google.maps.Animation.DROP
        });
        marker.pinRef = pin;
        marker.addListener('click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
            currentlyActiveInfowindowPin = marker.pinRef;
            // console.log(currentlyActiveInfowindowPin);
        });
        markers.push(marker);
        // markerTypes.push(typeOfMarker(pin));
    });

}