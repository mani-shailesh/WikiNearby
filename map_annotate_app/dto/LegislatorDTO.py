class LegislatorDTO:
    """
    This class represents the data transfer object for a Sansad record.
    """

    def __init__(self):
        """
        Constructor to initialize this object.
        """

        self.first_name = ""
        self.last_name = ""
        self.location = None
        self.no_questions = None
        self.party = ""

    def json_dict(self):
        """
        Returns a python dictionary to be used for building JSON response.
        """

        return_dict = dict()
        return_dict['first_name'] = self.first_name
        return_dict['last_name'] = self.last_name
        return_dict['location'] = self.location.json_dict()
        return_dict['no_questions'] = str(self.no_questions)
        return_dict['party'] = self.party
        return return_dict
