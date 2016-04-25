"""
For more details, see the class documentation.
"""

class LegislatorDAO:
    """
    This class represents the data access layer for a Sansad record.
    """

    def __init__(self):
        pass

    @staticmethod
    def get_legislator_list(legislator_filter):
        """
        Gets crimes which fit the filter from database.
        C{legislator_filter} is a C{LegislatorFilter} object to filter out the crimes.
        This returns a list of C{LegislatorDTO} objects which satisfy the C{crime_filter}.
        """

        return_list = []
        return return_list
