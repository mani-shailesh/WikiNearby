class WikiInfoDTO:
    def __init__(self):
        """
        Constructor to initialize this object.
        """
        self.location = None
        self.title = ""
        self.link = ""
        self.info = ""

    def json_dict(self):
        """
        Returns dictionary to be used for building JSON response.
        :return: A python dictionary.
        """
        return_dict = dict()
        return_dict['title'] = self.title
        return_dict['link'] = self.link
        return_dict['info'] = self.info
        return_dict['location'] = self.location.json_dict()
        # TODO: Add page ID
        return return_dict
