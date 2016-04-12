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

// Remove the below code when ready for production!
sideNavState = true;
var doubleToggleSideNav = function () {
    if (sideNavState) {
        $('.button-collapse').sideNav('hide');
        sideNavState = false;
    } else {
        $('.button-collapse').sideNav('show');
        sideNavState = true;
    }
};
$('#mainBranding').click(doubleToggleSideNav);

$('#map').click(hideSoftKeyboard);
$(".button-collapse").sideNav();

// Show overlay menu
// $('.button-collapse').sideNav('show');

// Hide overlay menu
// $('.button-collapse').sideNav('hide');
