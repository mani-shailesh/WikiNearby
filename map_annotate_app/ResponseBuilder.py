"""
JSON output required by `views.get_response()` is returned by the functions of this class.
"""

from django.http import JsonResponse
from django.utils import timezone

from map_annotate_app.dao import CrimeDAO
from map_annotate_app.dao import LegislatorDAO
from map_annotate_app.dao import WikiInfoDAO
from map_annotate_app.extras import Boundary
from map_annotate_app.extras import Location
from map_annotate_app.extras import Pin
from map_annotate_app.filters import CrimeFilter
from map_annotate_app.filters import LegislatorFilter
from map_annotate_app.filters import WikiInfoFilter

SQUARE_SIZE = 150


class ResponseBuilder:
    """
    Class to build the JSON response to be sent to client.
    """

    def __init__(self, request):
        """
        Initializes the appropriate class variables and filters.
        `request` refers to the request sent by the client.
        """

        if request.method == 'GET':
            self.query_dict = request.GET
        else:
            self.query_dict = request.POST

        north_east = Location.Location(float(self.query_dict.get('north_east_lat')),
                                       float(self.query_dict.get('north_east_lng')))

        south_west = Location.Location(float(self.query_dict.get('south_west_lat')),
                                       float(self.query_dict.get('south_west_lng')))

        date_from = self.query_dict.get('dateFrom')
        date_to = self.query_dict.get('dateTo')
        if date_from:
            date_from = str(timezone.datetime.strptime(date_from + " 00:00:00", "%d %B, %Y %H:%M:%S"))
        if date_to:
            date_to = str(timezone.datetime.strptime(date_to + " 23:59:59", "%d %B, %Y %H:%M:%S"))

        type_id_list = []
        for __type_id in self.query_dict.get('crimeTypeId').split(','):
            try:
                __type_id = int(__type_id)
            except ValueError:
                continue
            type_id_list.append(__type_id)

        self.crime_filter = CrimeFilter.CrimeFilter(north_east, south_west, type_id_list, date_from, date_to)

        self.legislator_filter = LegislatorFilter.LegislatorFilter(north_east, south_west)

        self.wiki_info_filter = WikiInfoFilter.WikiInfoFilter(north_east, south_west)

        self.map_width = int(self.query_dict.get('map_width'))
        self.map_height = int(self.query_dict.get('map_height'))

        self.map_boundary = Boundary.Boundary(north_east, south_west)

    def get_crimes(self):
        """
        Helper method to get a list of `Pin` objects which satisfy the `CrimeFilter`.
        This function returns a `list` of `Pin` objects.
        """

        pin_list = []
        crime_dao = CrimeDAO.CrimeDAO()

        crime_dto_list = crime_dao.get_crime_list(self.crime_filter)

        for crime_dto in crime_dto_list:
            pin_list.append(Pin.Pin(crime_dto.location, [crime_dto], [], []))

        return pin_list
        # return crime_dao.get_crime_list(self.crime_filter)

    def get_wiki_info(self):
        """
        Helper method to get a list of `Pin` objects which satisfy the filter.
        This function returns a `list` of `Pin` objects.
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
        This function returns a `list` of `Pin` objects.
        """

        legislator_dao = LegislatorDAO.LegislatorDAO()
        legislator_dto_list = legislator_dao.get_legislator_list(self.legislator_filter)

        pin_list = []
        for legislator_dto in legislator_dto_list:
            pin_list.append(Pin.Pin(legislator_dto.location, [], [legislator_dto], []))

        return pin_list

    def converge(self, pin_list):
        """
        Converts the raw data from the data access layer into a suitable format to respond
        to a client's request.
        """

        no_rows = int(self.map_height / SQUARE_SIZE) + 1
        if no_rows % 2 == 0:
            no_rows += 1
        no_columns = int(self.map_width / SQUARE_SIZE) + 1
        if no_columns % 2 == 0:
            no_columns += 1

        lat_diff = abs(self.map_boundary.north_east.lat - self.map_boundary.south_west.lat)
        lng_diff = abs(self.map_boundary.north_east.lng - self.map_boundary.south_west.lng)
        if lng_diff > 180:
            lng_diff = abs(360 - lng_diff)

        lat_square_size = lat_diff / no_rows
        lng_square_size = lng_diff / no_columns

        # noinspection PyUnusedLocal,PyUnusedLocal
        map_mat = [[[] for jj in range(no_columns)] for ii in range(no_rows)]  # Matrix of lists to hold pins

        for pin in pin_list:
            lng_diff = abs(pin.location.lng - self.map_boundary.south_west.lng)
            if lng_diff > 180:
                lng_diff = abs(360 - lng_diff)
            lat_diff = abs(pin.location.lat - self.map_boundary.north_east.lat)

            this_row = int(lat_diff / lat_square_size)
            this_column = int(lng_diff / lng_square_size)

            if this_row >= no_rows or this_column >= no_columns:
                continue

            map_mat[this_row][this_column].append(pin)

        return_list = []

        for ii in range(no_rows):
            for jj in range(no_columns):
                new_pin = self.converge_to_one(map_mat[ii][jj])
                if new_pin is not None:
                    return_list.append(new_pin)

        return return_list

    @staticmethod
    def converge_to_one(pin_list):
        """
        Utility function to converge pins in one square to a single pin.
        `pin_list` is a  `list` of `Pin` objects.
        This function returns a `Pin` object.
        """

        if len(pin_list) == 0:
            return None

        crime_list = []
        wiki_info_list = []
        legislator_list = []
        lat_sum = 0.0
        lng_sum = 0.0

        crime_overflow = False
        wiki_info_overflow = False
        legislator_overflow = False

        no_of_pins = 0
        for pin in pin_list:
            pin_included = False
            if not crime_overflow:
                crime_list += pin.crime_list
                pin_included = True
                if len(crime_list) >= 10:
                    crime_overflow = True
            if not wiki_info_overflow:
                wiki_info_list += pin.wiki_info_list
                pin_included = True
                if len(wiki_info_list) >= 10:
                    wiki_info_overflow = True
            if not legislator_overflow:
                legislator_list += pin.legislator_list
                pin_included = True
                if len(legislator_list) >= 10:
                    legislator_overflow = True
            if pin_included:
                no_of_pins += 1
                lat_sum += pin.location.lat
                lng_sum += pin.location.lng  # TODO: May cause errors with pins near +180 and -180
            if crime_overflow and wiki_info_overflow and legislator_overflow:
                break

        final_location = Location.Location(lat_sum / no_of_pins, lng_sum / no_of_pins)
        final_pin = Pin.Pin(final_location, crime_list, legislator_list, wiki_info_list)
        return final_pin

    def get_response_json(self):
        """
        Processes the request to fetch appropriate response.
        This function returns a JSON response to be sent to client.
        """

        if self.query_dict['query'] == 'get':
            if self.query_dict['item'] == 'pins':
                return self.get_pins_json()

    def get_pins_json(self):
        """
        Processes request to fetch appropriate pins.
        This function returns a JSON response.
        """

        crime_pin_list = []
        wiki_pin_list = []
        legislator_pin_list = []

        if self.query_dict['pinCategory'] == "Crime":
            crime_pin_list = self.get_crimes()
        elif self.query_dict['pinCategory'] == "Wikipedia":
            wiki_pin_list = self.get_wiki_info()
        else:
            crime_pin_list = self.get_crimes()
            wiki_pin_list = self.get_wiki_info()
            legislator_pin_list = self.get_legislators()

        final_pin_list = crime_pin_list + wiki_pin_list + legislator_pin_list
        final_pin_list = self.converge(final_pin_list)
        json_dict = {'pins': [i.json_dict() for i in final_pin_list]}

        return JsonResponse(json_dict)
