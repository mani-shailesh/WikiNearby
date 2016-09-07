"""
For more details, see the class documentation.
"""

from math import radians, cos, sin, asin, sqrt

from map_annotate_app.extras import Location


class WikiInfoFilter:
    """
    This class encapsulates functionality and data entities for filtering Wikipedia's geotagged data
    based on the client's query.
    """

    def __init__(self, north_east, south_west, lang):
        centre_lat = (north_east.lat + south_west.lat) / 2
        centre_lng = (north_east.lng + south_west.lng) / 2  # TODO: May cause problems at intersection of +180, -180
        self.centre = Location.Location(centre_lat, centre_lng)
        self.radius = haversine(self.centre.lng, self.centre.lat,
                                north_east.lng, north_east.lat)
        self.lang = lang
        if self.lang == "" or self.lang == 'null' or self.lang is None:
            self.lang = 'en'
        if self.radius > 10000:
            self.radius = 10000


# Code copied from online resources
def haversine(lon1, lat1, lon2, lat2):
    """
    Calculates the great circle distance(in meters) between two points
    on the earth (specified in decimal degrees).
    """

    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    km = 6367 * c
    return km * 1000
