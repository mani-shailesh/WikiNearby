class Location:
    def __init__(self, lat, lng):
        """
        Initializes this object.
        lat is a parameter which stores the Latitude of the location
        lng is a parameter which stores the Longitude of the location
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
