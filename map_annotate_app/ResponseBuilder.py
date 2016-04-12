from django.http import JsonResponse

from map_annotate_app.dao import CrimeDAO
from map_annotate_app.dao import LegislatorDAO
from map_annotate_app.dao import WikiInfoDAO
from map_annotate_app.extras import Pin
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
        Helper method to get a list of `Pin` objects which satisfy the `CrimeFilter`.
        :return: List of `Pin` objects.
        """
        crime_dao = CrimeDAO.CrimeDAO()
        crime_dto_list = crime_dao.get_crime_list(self.crime_filter)
        pin_list = []
        for crime_dto in crime_dto_list:
            pin_list.append(Pin.Pin(crime_dto.location, [crime_dto], [], []))

        return pin_list

    def get_wiki_info(self):
        """
        Helper method to get a list of `Pin` objects which satisfy the filter.
        :return: List of `Pin` objects.
        """
        wiki_info_dao = WikiInfoDAO.WikiInfoDAO()
        wiki_dto_list = wiki_info_dao.get_wiki_info_list(self.wiki_info_filter)
        pin_list = []
        for wiki_dto in wiki_dto_list:
            pin_list.append(Pin.Pin(wiki_dto.location, [], [], [wiki_dto]))

        return pin_list

    def get_legislators(self):
        """
        Helper method to get a list of `Pin` objects which satisfy the filter.
        :return: List of `Pin` objects.
        """
        legislator_dao = LegislatorDAO.LegislatorDAO()
        legislator_dto_list = legislator_dao.get_legislator_list(self.legislator_filter)

        pin_list = []
        for legislator_dto in legislator_dto_list:
            pin_list.append(Pin.Pin(legislator_dto.location, [], [legislator_dto], []))

        return pin_list

    def converge_single_type(self, pin_list):
        """
        Utility function to converge pins of single type to one per square.
        :param pin_list: List of `Pin` objects of single type.
        :return: List of `Pin` objects.
        """
        # TODO

        return []

    def converge_multiple_type(self, pin_list):
        """
        Utility function to converge pins of different types to one per square.
        :param pin_list: List of `Pin` objects of multiple types.
        :return: List of `Pin` objects.
        """
        # TODO

        return []

    def converge_to_one(self, pin_list):
        """
        :param pin_list: List of `Pin` objects.
        Utility function to converge pins in one square to a single pin.
        :return:
        """
        # TODO

        pass

    def get_response_json(self):
        """
        Processes the request to fetch appropriate response.
        :return:JSON to be sent to client
        """
        crime_pin_list = self.get_crimes()
        wiki_pin_list = self.get_wiki_info()
        legislator_pin_list = self.get_legislators()

        crime_pin_list = self.converge_single_type(crime_pin_list)
        wiki_pin_list = self.converge_single_type(wiki_pin_list)
        legislator_pin_list = self.converge_single_type(legislator_pin_list)

        final_pin_list = crime_pin_list + wiki_pin_list + legislator_pin_list

        final_pin_list = self.converge_multiple_type(final_pin_list)

        json_dict = {'pins': final_pin_list}

        return JsonResponse(json_dict)
