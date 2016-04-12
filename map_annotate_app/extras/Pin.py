class Pin:
    def __init__(self, location, crime_list, legislator_list, wiki_info_list):
        """
        Initializes this object.
        :param crime_list: List of `CrimeDTO` objects.
        :param legislator_list: List of `LegislatorDTO` objects.
        :param wiki_info_list: List of `WikiInfoDTO` objects.
        """
        self.location = location  # `Location` where this `Pin` has to be placed.

        self.crime_list = list(crime_list)  # List of `CrimeDTO` objects represented by this Pin.

        self.legislator_list = list(legislator_list)  # List of `LegislatorDTO` objects represented by this Pin.

        self.wiki_info_list = list(wiki_info_list)  # List of `WikiInfoDTO` objects represented by this Pin.

    def json_dict(self):
        """
        Returns dictionary to be used for building JSON response.
        :return: A python dictionary.
        """

        # TODO: Truncate the list of crimes etc. at a threshold

        return_dict = dict()
        return_dict['location'] = self.location.json_dict()
        return_dict['crime_list'] = [i.json_dict() for i in self.crime_list]
        return_dict['legislator_list'] = [i.json_dict() for i in self.legislator_list]
        return_dict['wiki_info_list'] = [i.json_dict() for i in self.wiki_info_list]
        return return_dict
