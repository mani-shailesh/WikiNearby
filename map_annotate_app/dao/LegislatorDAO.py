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
        `legislator_filter` is a `LegislatorFilter` object to filter out the crimes.
        This returns a list of `LegislatorDTO` objects which satisfy the `crime_filter`.
        """

        return_list = []
        return return_list
