from map_annotate_app.dto import CrimeDTO
from map_annotate_app.models import Crime


class CrimeDAO:
    def __init__(self):
        pass

    # noinspection PyUnusedLocal,PyMethodMayBeStatic
    def get_crime_list(self, crime_filter):
        """
        Gets crimes which fit the filter from database.
        crime_filter is an object of class `CrimeFilter` which is used to filter out the crimes

        It returns a list of `CrimeDTO` objects which satisfy the `crime_filter`
        """

        return_list = []
        crime_obj = Crime.objects

        if crime_filter.type_id:
            crime_obj = crime_obj.filter(type_id=crime_filter.type_id)

        if crime_filter.north_east and crime_filter.south_west:
            crime_obj = crime_obj.filter(location__lat__lte=crime_filter.north_east.lat) \
                .filter(location__lat__gte=crime_filter.south_west.lat) \
                .filter(location__lng__lte=crime_filter.north_east.lng) \
                .filter(location__lng__gte=crime_filter.south_west.lng)

        if crime_filter.dateFrom:
            crime_obj = crime_obj.filter(timestamp__gte=crime_filter.dateFrom)

        if crime_filter.dateTo:
            crime_obj = crime_obj.filter(timestamp__lte=crime_filter.dateTo)

        for each in crime_obj.all():
            crime_data_dto = CrimeDTO.CrimeDTO()
            crime_data_dto.type = str(each.type)
            crime_data_dto.fir_no = each.fir_number
            crime_data_dto.location = each.location
            crime_data_dto.timestamp = each.timestamp
            crime_data_dto.url_link = "http://www.zipnet.in"
            return_list.append(crime_data_dto)

        return return_list
