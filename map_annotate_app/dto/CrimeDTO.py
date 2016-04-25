from map_annotate_app.extras import Location


class CrimeDTO:
    """
    This class represents the data transfer object for a crime record.
    """

    def __init__(self):
        """
        Constructor to initialize this object.
        """

        self.type = ""
        self.fir_no = ""
        self.location = None
        self.timestamp = None
        self.url_link = ""

    def json_dict(self):
        """
        Returns a python dictionary to be used for building JSON response.
        """

        return_dict = dict()
        return_dict['type'] = self.type
        return_dict['fir_no'] = self.fir_no
        return_dict['location'] = Location.Location(self.location.lat, self.location.lng).json_dict()
        return_dict['timestamp'] = str(self.timestamp)
        return_dict['url_link'] = self.url_link
        return return_dict
