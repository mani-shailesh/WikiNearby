// This prototype displays a marker at the center of IIT Ropar.
// When the user clicks the marker, an info window opens.

// var IITRopar = {lat: 30.9755, lng: 76.5395};
var map;

// Helper variabls to display the indeterminate loader on top of the screen
var oldTileCoordinate;
var TILE_SIZE = 256;

function initMap() {
    return new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: -34.397, lng: 150.644},
        mapTypeControl: false,
        streetViewControl: false
    });

}

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

function handleLocationError(browserHasGeolocation) {
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.', 2000); // last number is the duration of the toast
}

function project(latLng) {
    var siny = Math.sin(latLng.lat() * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}

function getNewTileCoordinate() {
    var currentBounds = map.getBounds();
    var currentCenterLatLng = currentBounds.getCenter();
    var scale = 1 << map.getZoom();
    var worldCoordinate = project(currentCenterLatLng);
    return new google.maps.Point(
        Math.floor(worldCoordinate.x * scale / TILE_SIZE),
        Math.floor(worldCoordinate.y * scale / TILE_SIZE));
}

function initAutocomplete() {

    map = initMap();

    google.maps.event.addListener(map, 'bounds_changed', function () {
        var newTileCoordinate = getNewTileCoordinate();
        // console.log(newTileCoordinate);
        if (typeof oldTileCoordinate != 'undefined') {
            // console.log("Updating");
            if ((Math.abs(newTileCoordinate.x - oldTileCoordinate.x) >= 2) || (Math.abs(newTileCoordinate.y - oldTileCoordinate.y) >= 2)) {
                // console.log("Changed!");
                $('.activityIndicator').fadeIn(200);
            }
        }
    });

    google.maps.event.addListener(map, 'tilesloaded', function () {
        // console.log("Loaded!");
        oldTileCoordinate = getNewTileCoordinate();
        // console.log("Loaded");
        $('.activityIndicator').fadeOut(200);
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

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

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