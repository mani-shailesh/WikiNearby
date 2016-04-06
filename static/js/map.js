// This prototype displays a marker at the center of IIT Ropar.
// When the user clicks the marker, an info window opens.

// var IITRopar = {lat: 30.9755, lng: 76.5395};
var map;

function initMap() {
    var newMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: -34.397, lng: 150.644},
        mapTypeControl: false
    });

    return newMap;

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
            map.setZoom(16);
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

function initAutocomplete() {

    map = initMap();

    // HTML5 geolocation
    userGeolocation();

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
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