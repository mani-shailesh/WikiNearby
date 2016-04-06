// This prototype displays a marker at the center of IIT Ropar.
// When the user clicks the marker, an info window opens.
var IITRopar = {lat: 30.9755, lng: 76.5395};
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: IITRopar,
        mapTypeControl: false
    });

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">IIT Ropar</h3>' +
        '<div id="bodyContent">' +
        '<p>The Indian Institute of Technology Ropar (IIT Ropar) or IIT-RPR,' +
        ' is an engineering and technology higher education institute located in Rupnagar, Punjab, India.' +
        ' It is one of the eight newer Indian Institutes of Technology (IITs) established by the Ministry ' +
        'of Human Resource Development MHRD, Government of India under The Institutes of Technology (Amendment) Act, ' +
        '2011. The Act was passed in the Lok Sabha on 24 March 2011 and by the Rajya Sabha on 30 April 2012.' +
        '</p>' +
        '<p>Attribution: IIT Ropar, <a target="_blank" href="https://en.wikipedia.org/wiki/Indian_Institute_of_Technology_Ropar">' +
        'https://en.wikipedia.org/wiki/Indian_Institute_of_Technology_Ropar</a> ' +
        '</p>' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: IITRopar,
        map: map,
        title: 'IIT Ropar'
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    return map;

    // This example adds a search box to a map, using the Google Place Autocomplete
    // feature. People can enter geographical searches. The search box will return a
    // pick list containing a mix of places and predicted search terms.

    // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

}

function initAutocomplete() {
    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: IITRopar,
    //     zoom: 12,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    // });

    var map = initMap();

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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