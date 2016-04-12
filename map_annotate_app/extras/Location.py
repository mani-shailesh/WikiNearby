class Location:
    def __init__(self, lat, lng):
        """
        Initializes this object.
        :param lat: Latitude
        :param lng: Longitude
        """
        # self.name = ""
        self.lat = lat
        self.lng = lng

    def json_dict(self):
        """
        Returns dictionary to be used for building JSON response.
        :return: A python dictionary.
        """
        return_dict = {'lat': self.lat, 'lng': self.lng}
        return return_dict
