class CrimeDTO:
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
        Returns dictionary to be used for building JSON response.
        :return: A python dictionary.
        """
        return_dict = dict()
        return_dict['type'] = self.type
        return_dict['fir_no'] = self.fir_no
        return_dict['location'] = self.location.json_dict()
        return_dict['timestamp'] = str(self.timestamp)
        return_dict['url_link'] = self.url_link
        return return_dict
