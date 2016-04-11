// Filter modal configuration

$('#filterModalTrigger').leanModal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200
        // ready: function() { alert('Ready'); },
        // complete: function() { alert('Closed'); }
    }
);

// Function "userGeolocation()" and "map" is declared and initialized in
// map.js
$('#myLocationButton').click(userGeolocation);

// iOS specific jQuery
var hideSoftKeyboard = function() {
    document.activeElement.blur();
    $("input").blur();
};

$('#map').click(hideSoftKeyboard);
