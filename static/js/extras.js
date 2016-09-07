/*globals $, map:true, oldTileCoordinate:true, TILE_SIZE, mapLoaded:true, dataLoaded:true,
   INVALID_PIN, MULTI_PIN, CRIME_PIN, LEGISLATOR_PIN, WIKI_PIN, crimePicture:true,
   sansadPicture:true, wikiPicture:true, initAutoComplete:true, markers:true, infowindow:true,
   currentlyActiveInfowindowPin:true, queryData:true, setNewMarkers:true,
   handleMoreDetailsEvent:true, zoomIntoPin:true
*/

/**
 * @file Declares and defines important functions required for upstream functions and code.
 * @author Tushar Agarwal
 */

/**
 * The <code>pinManager</code> namespace encapsulates pin and marker related functionality.
 * @namespace extrasManager
 */
(function () {

    /**
     * This function sends an AJAX request to the server and sets new markers and removes old markers when new data is
     * loaded from the server. The global variable <code>queryData</code> is declared in <code>globals.js</code>.
     * @function
     * @memberof extrasManager
     */
    queryData = function () {
        $('.activityIndicator').fadeIn(200);
        dataLoaded = false;
        var url = window.location.href;
        var urlArr = url.split("/");
        var mapSelector = $('#map');
        var mapBounds = map.getBounds();
        var urlResult = urlArr[0] + "//" + urlArr[2] + "/" + "api/?query=get" +
            "&item=" + "pins" +
            "&map_width=" + mapSelector.width() +
            "&map_height=" + mapSelector.height() +
            "&north_east_lat=" + mapBounds.getNorthEast().lat() +
            "&north_east_lng=" + mapBounds.getNorthEast().lng() +
            "&south_west_lat=" + mapBounds.getSouthWest().lat() +
            "&south_west_lng=" + mapBounds.getSouthWest().lng() +
            // "&crimeTypeId=" + $('#crimeType').val().join() +
            "&dateFrom=" + $('#fromDatePicker')[0].value +
            "&dateTo=" + $('#toDatePicker')[0].value +
            "&lang=" + $('#wikiLang').val() +
            "&pinCategory=" + $('#filterTabsArea').find('a.active')[0].text;

        $.ajax({
            url: urlResult, success: function (queryResponse) {
                //noinspection JSUndeclaredVariable
                dataLoaded = true;
                if (mapLoaded && dataLoaded) {
                    $('.activityIndicator').fadeOut(200);
                }

                // Very basic validity check
                //noinspection JSUnresolvedVariable
                if (typeof queryResponse != 'undefined' && typeof queryResponse.pins != 'undefined') {
                    setNewMarkers(queryResponse);
                }
            }
        });
    };

    // This statement initializes the filter settings modal with default parameters.
    $('#filterModalTrigger').leanModal({
            dismissible: true,
            opacity: .5,
            in_duration: 300,
            out_duration: 200,
            // ready: function() { alert('Ready'); },
            complete: queryData
        }
    );

    // Helper selectors to help enforce sane behaviour on date range
    var fromDateSelector = $('#fromDatePicker');
    var toDateSelector = $('#toDatePicker');

    // This statement initializes a date selector in the filter settings modal.
    var fromDatePicker = fromDateSelector.pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: true // Creates a dropdown of 15 years to control year
    }).pickadate('picker');

    // This statement initializes a date selector in the filter settings modal.
    var toDatePicker = toDateSelector.pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: true // Creates a dropdown of 15 years to control year
    }).pickadate('picker');

    // This statement enforces sane behaviour on the date range selectors.
    fromDateSelector.on('change', function () {
        var dateToSet = fromDatePicker.get();
        toDatePicker.set('min', dateToSet);
    });

    // This statement enforces sane behaviour on the date range selectors.
    toDateSelector.on('change', function () {
        var dateToSet = toDatePicker.get();
        fromDatePicker.set('max', dateToSet);
    });

    /**
     * iOS specific jQuery to hide soft keyboard when not in use.
     * @memberof extrasManager
     * @function
     */
    var hideSoftKeyboard = function () {
        document.activeElement.blur();
        $("input").blur();
    };

    // iOS specific jQuery to hide soft keyboard when not in use.
    $('#map').click(hideSoftKeyboard);

    // This statement initializes the side-navigation settings modal.
    $(".button-collapse").sideNav();

    // This statement initializes <code>select</code> elements throughout the DOM with <code>material_select()</code>.
    $('select').material_select();

})();