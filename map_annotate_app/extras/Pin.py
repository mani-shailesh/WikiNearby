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
