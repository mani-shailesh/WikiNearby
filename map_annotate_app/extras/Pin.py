"""
For more details, see the class documentation.
"""

class Pin:
    """
    This class represents a "Pin" on the Google Maps map.
    """

    def __init__(self, location, crime_list, legislator_list, wiki_info_list):
        """
        Initializes this object.
        crime_list is a list which has the list of C{CrimeDTO} objects.
        legislator_list is a list which has the list of C{LegislatorDTO} objects.
        wiki_info_list is a list which has the list of C{WikiInfoDTO} objects.
        """
        self.location = location  # C{Location} where this C{Pin} has to be placed.

        self.crime_list = list(crime_list)  # List of C{CrimeDTO} objects represented by this Pin.

        self.legislator_list = list(legislator_list)  # List of C{LegislatorDTO} objects represented by this Pin.

        self.wiki_info_list = list(wiki_info_list)  # List of C{WikiInfoDTO} objects represented by this Pin.

    def json_dict(self):
        """
        Returns a  python dictionary to be used for building JSON response.
        """

        # TODO: Truncate the list of crimes etc. at a threshold

        return_dict = dict()
        return_dict['location'] = self.location.json_dict()
        return_dict['crime_list'] = [i.json_dict() for i in self.crime_list]
        return_dict['legislator_list'] = [i.json_dict() for i in self.legislator_list]
        return_dict['wiki_info_list'] = [i.json_dict() for i in self.wiki_info_list]
        return return_dict
