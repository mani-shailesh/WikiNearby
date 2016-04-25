from django.db.models import Q

from map_annotate_app.dto import CrimeDTO
from map_annotate_app.extras import Location
from map_annotate_app.models import Crime


class CrimeDAO:
    """
    This class represents the data access layer for a crime record.
    """

    def __init__(self):
        pass

    @staticmethod
    def get_crime_list(crime_filter):
        """
        Gets crimes which pass the filter from database.
        `crime_filter` is an object of class `CrimeFilter` which is used to filter out the crimes.
        Returns a list of `CrimeDTO` objects which satisfy the `crime_filter`
        """

        return_list = []
        crime_obj = Crime.objects

        if len(crime_filter.type_id_list) > 0:
            filter_type_parameter = Q(type_id=crime_filter.type_id_list[0])
            for type_id in crime_filter.type_id_list[1:]:
                filter_type_parameter = filter_type_parameter | Q(type_id=type_id)
            crime_obj = crime_obj.filter(filter_type_parameter)

        if crime_filter.north_east and crime_filter.south_west:
            # TODO: May cause errors when longitude varies from +180 to -180
            crime_obj = crime_obj.filter(location__lat__lte=crime_filter.north_east.lat,
                                         location__lat__gte=crime_filter.south_west.lat,
                                         location__lng__lte=crime_filter.north_east.lng,
                                         location__lng__gte=crime_filter.south_west.lng, )

        if crime_filter.dateFrom:
            crime_obj = crime_obj.filter(timestamp__gte=crime_filter.dateFrom)

        if crime_filter.dateTo:
            crime_obj = crime_obj.filter(timestamp__lte=crime_filter.dateTo)

        result_set = crime_obj.select_related('location', 'type').all()

        for each in result_set:
            crime_data_dto = CrimeDTO.CrimeDTO()
            crime_data_dto.type = str(each.type.crime_type)
            # crime_data_dto.type = "mobile theft"
            crime_data_dto.fir_no = "\"" + str(each.fir_number) + "\""
            crime_data_dto.location = Location.Location(each.location.lat, each.location.lng)
            # crime_data_dto.location = Location.Location(23, 45)
            crime_data_dto.timestamp = each.timestamp.strftime("%d %B, %Y %H:%M:%S")
            crime_data_dto.url_link = "http://www.zipnet.in"
            return_list.append(crime_data_dto)
            # return_list.append(Pin.Pin(crime_data_dto.location, [crime_data_dto], [], []))

        return return_list
