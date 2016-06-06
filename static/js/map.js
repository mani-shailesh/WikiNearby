/**
 * @file Initializes and manages a Google Maps instance.
 * Declares helper functions to track the movement and loading of the map.
 * @author Tushar Agarwal
 */

/* global
   map
   oldTileCoordinate
   TILE_SIZE
   mapLoaded
   dataLoaded
   INVALID_PIN
   MULTI_PIN
   CRIME_PIN
   LEGISLATOR_PIN
   WIKI_PIN
   crimePicture
   sansadPicture
   wikiPicture
   initAutoComplete
   markers
   infowindow
   currentlyActiveInfowindowPin
   queryData
   setNewMarkers
   handleMoreDetailsEvent
   zoomIntoPin
*/

/**
 * The <code>mapManager</code> namespace encapsulates core map related functionality.
 * @namespace mapManager
 */
(function () {
    /**
     * Initializes a Google Maps instance centered (zoom level 12) at New Delhi, India.
     * Map type and Street View controls are hidden.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     * @returns {google.maps.Map}
     */
    function initMap() {
        return new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 28.6139, lng: 77.2090},
            mapTypeControl: false,
            streetViewControl: false
        });
    }

    /**
     * Checks if the <code>Geolocation Service</code> is available and
     * centers the map at the client's geographic location if it is.
     * The default zoom level is 12.
     * This function handles errors using <code>handleLocationError()</code>.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
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

    /**
     * Triggers a "Toast"(<code>Materialize.toast</code>) notification based
     * on the type of geolocation error (as inferred from <code>browserHasGeolocation</code>)
     * and prints user-friendly error messages.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     * @param {boolean} browserHasGeolocation
     */
    function handleLocationError(browserHasGeolocation) {
        // Materialize.toast(message, displayLength, className, completeCallback);
        Materialize.toast(browserHasGeolocation ?
            'Is the Location Service enabled?' :
            'Your browser doesn\'t support geolocation.', 2000); // last number is the duration of the toast
    }

    /**
     * Calculates a "Point" from a latitude-longitude coordinate pair.
     * This is a helper function for <code>getNewTileCoordinate()</code>.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     * @param {google.maps.LatLng} latLng
     * @returns {google.maps.Point}
     */
    function project(latLng) {
        var siny = Math.sin(latLng.lat() * Math.PI / 180);
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new google.maps.Point(
            TILE_SIZE * (0.5 + latLng.lng() / 360),
            TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
    }

    /**
     * Calculates the map's center's tile coordinates based on the <code>TILE_SIZE</code>.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     * @returns {google.maps.Point}
     */
    function getNewTileCoordinate() {
        var currentBounds = map.getBounds();
        var currentCenterLatLng = currentBounds.getCenter();
        var scale = 1 << map.getZoom();
        var worldCoordinate = project(currentCenterLatLng);
        return new google.maps.Point(
            Math.floor(worldCoordinate.x * scale / TILE_SIZE),
            Math.floor(worldCoordinate.y * scale / TILE_SIZE));
    }

    /**
     * This is a listener for the <code>bounds_changed</code> event, so that the indeterminate loader can be triggered.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
    function boundsChangedListener() {
        var newTileCoordinate = getNewTileCoordinate();
        if (typeof oldTileCoordinate != 'undefined') {
            if ((Math.abs(newTileCoordinate.x - oldTileCoordinate.x) >= 2)
                || (Math.abs(newTileCoordinate.y - oldTileCoordinate.y) >= 2)) {
                mapLoaded = false;
                $('.activityIndicator').fadeIn(200);
            }
        }
    }

    /**
     * This is a listener for the <code>tilesloaded</code> event, so that the indeterminate loader can be turned off.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
    function tilesLoadedListener() {
        oldTileCoordinate = getNewTileCoordinate();
        mapLoaded = true;
        if (mapLoaded && dataLoaded) {
            $('.activityIndicator').fadeOut(200);
        }
    }

    /**
     * This is a listener for the map's <code>idle</code> event, to load pins when the map
     * transitions to an idle state.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
    function mapIdleListener() {
        queryData();
    }

    /**
     * Listens for the event fired when the user selects a prediction and centers the map on that location.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     * @param {google.maps.places.SearchBox} searchBox
     */
    function searchBoxListener(searchBox) {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    }

    /**
     * Creates the search box and links it to the UI element.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
    function constructSearchBox() {
        var input = document.getElementById('search-input');

        //noinspection JSCheckFunctionSignatures
        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            searchBoxListener(searchBox);
        });
    }

    //noinspection JSUndeclaredVariable
    /**
     * Initializes a Google Maps object, and adds listeners for <code>bounds_changed</code> and
     * <code>tilesloaded</code>, so that the indeterminate loader can be triggered and turned off.
     * The global variable corresponding to this function is declared in <code>globals.js</code>.
     * Some code from https://developers.google.com/maps/documentation/javascript/reference#release-version
     * @memberof mapManager
     */
    initAutocomplete = function () {

        map = initMap();

        // Enable Listeners
        google.maps.event.addListener(map, 'bounds_changed', boundsChangedListener);
        google.maps.event.addListener(map, 'tilesloaded', tilesLoadedListener);
        google.maps.event.addListener(map, 'idle', mapIdleListener);

        // HTML5 geolocation
        userGeolocation();

        // Construct the search box
        constructSearchBox();
    };

    // Enables functionality for the "Go to my location" button.
    $('#myLocationButton').click(userGeolocation);

})();
