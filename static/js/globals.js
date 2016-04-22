/**
 * @file Declares and initializes globals required for downstream functions and code.
 * @author Tushar Agarwal
 */

/**
 * The main Google Maps <code>Map</code> object.
 * @type {google.maps.Map}
 */
var map;

/**
 * A record of the old center coordinates of the map.
 * @type {google.maps.Point}
 */
var oldTileCoordinate;

/**
 * This size is used to calculate world coordinates and tile numbers in the map.
 * @type {number}
 */
var TILE_SIZE;

/**
 * A boolean to represent if the map is loaded.
 * This is used to trigger an indeterminate loader.
 * @type {boolean}
 */
var mapLoaded;

/**
 * A boolean to represent if the annotations are loaded.
 * This is used to trigger an indeterminate loader.
 * @type {boolean}
 */
var dataLoaded;

/**
 * Represents an invalid pin.
 * @type {number}
 */
var INVALID_PIN;

/**
 * Represents a multi-pin.
 * @type {number}
 */
var MULTI_PIN;

/**
 * Represents an crime pin.
 * @type {number}
 */
var CRIME_PIN;

/**
 * Represents an legislator-data pin.
 * @type {number}
 */
var LEGISLATOR_PIN;

/**
 * Represents an Wikipedia-data pin.
 * @type {number}
 */
var WIKI_PIN;

/**
 * The path to the crime "more details" pane image.
 * @type {string}
 */
var crimePicture;

/**
 * The path to the Sansad "more details" pane image.
 * @type {string}
 */
var sansadPicture;

/**
 * The path to the Wikipedia "more details" pane image.
 * @type {string}
 */
var wikiPicture;

//noinspection JSUnusedGlobalSymbols
/**
 * A handle to the <code>initAutoComplete()</code> for Google Maps API.
 * Initialized in <code>map.js</code>.
 */
var initAutoComplete;

/**
 * Initialize globals required for downstream functions and code.
 * @namespace initGlobals
 */
(function initGlobals() {

    map = undefined;
    oldTileCoordinate = undefined;
    TILE_SIZE = 256;
    mapLoaded = false;
    dataLoaded = false;

    // Types of pins
    INVALID_PIN = 0;
    MULTI_PIN = 1;
    CRIME_PIN = 2;
    LEGISLATOR_PIN = 3;
    WIKI_PIN = 4;

    // Global var staticImagesRootPath is declared and initialized in index.html

    //noinspection JSUnresolvedVariable
    crimePicture = staticImagesRootPath + '/crime-image.jpg';
    //noinspection JSUnresolvedVariable
    sansadPicture = staticImagesRootPath + '/sansad-image.jpg';
    //noinspection JSUnresolvedVariable
    wikiPicture = staticImagesRootPath + '/wiki-image.jpg';

})();
