from map_annotate_app.dao import CrimeDAO
from map_annotate_app.dao import LegislatorDAO
from map_annotate_app.dao import WikiInfoDAO
from map_annotate_app.filters import CrimeFilter
from map_annotate_app.filters import LegislatorFilter
from map_annotate_app.filters import WikiInfoFilter


class ResponseBuilder:
    """
    Class to build the JSON response to be sent to client.
    """

    def __init__(self, request):
        """
        Initializes the appropriate class variables and filters.
        :param request: Request sent by the client
        """
        if request.method == 'GET':
            query_dict = request.GET
        else:
            query_dict = request.POST

        self.crime_filter = CrimeFilter.CrimeFilter()
        self.legislator_filter = LegislatorFilter.LegislatorFilter()
        self.wiki_info_filter = WikiInfoFilter.WikiInfoFilter()
        self.screen_width = query_dict.get('screen_width')
        self.screen_height = query_dict.get('screen_height')

    def get_crimes(self):
        """
        Helper method to get a list of `CrimeDTO` objects which satisfy the filter.
        :return: List of `CrimeDTO` objects.
        """
        crime_dao = CrimeDAO.CrimeDAO()
        return crime_dao.get_crime_list(self.crime_filter)

    def get_wiki_info(self):
        """
        Helper method to get a list of `WikiInfo` objects which satisfy the filter.
        :return: List of `WikiInfoDTO` objects.
        """
        wiki_info_dao = WikiInfoDAO.WikiInfoDAO()
        return wiki_info_dao.get_wiki_info_list(self.wiki_info_filter)

    def get_legislators(self):
        """
        Helper method to get a list of `Legislator` objects which satisfy the filter.
        :return: List of `LegislatorDTO` objects.
        """
        legislator_dao = LegislatorDAO.LegislatorDAO()
        return legislator_dao.get_legislator_list(self.legislator_filter)

    def converge_single_type(self, pin_list):
        """
        Utility function to converge pins of single type to one per square.
        :param pin_list: List of `Pin` objects of single type.
        :return: List of `Pin` objects.
        """
        pass

    def converge_multiple_type(self, pin_list):
        """
        Utility function to converge pins of different types to one per square.
        :param pin_list: List of `Pin` objects of multiple types.
        :return: List of `Pin` objects.
        """
        pass

    def converge_to_one(self, pin_list):
        """
        :param pin_list: List of `Pin` objects.
        Utility function to converge pins in one square to a single pin.
        :return:
        """
        pass

    def get_response_dict(self):
        """
        Processes the request and returns the appropriate response dictionary
        containing key value pairs which satisfy filters.
        :return:
        """
        pass
