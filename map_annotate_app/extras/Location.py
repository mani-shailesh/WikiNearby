"""
For more details, see the class documentation.
"""

class Location:
    """
    Represents a location on the map in the form of a latitude-longitude pair.
    """

    def __init__(self, lat, lng):
        """
        Initializes this object.
        C{lat} is a parameter which stores the latitude of the location.
        C{lng} is a parameter which stores the longitude of the location.
        """
        # self.name = ""
        self.lat = lat
        self.lng = lng

    def json_dict(self):
        """
        Returns a python dictionary to be used for building JSON response.
        """

        return_dict = {'lat': self.lat, 'lng': self.lng}
        return return_dict
