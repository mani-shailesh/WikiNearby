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
        # TODO: Add actual implementation

        return_list = []

        # Dummy Data
        # crime_data_dto2 = CrimeDTO.CrimeDTO()
        # crime_data_dto2.type = "Mobile"
        # crime_data_dto2.fir_no = "0001"
        # crime_data_dto2.location = Location.Location(30.97069152, 76.5583992)
        # crime_data_dto2.timestamp = timezone.datetime.strptime("25 August, 2016", "%d %B, %Y")
        # crime_data_dto2.url_link = "http://www.google.com"
        # return_list.append(crime_data_dto2)
        #
        # crime_data_dto = CrimeDTO.CrimeDTO()
        # crime_data_dto.type = "Mobile"
        # crime_data_dto.fir_no = "0002"
        # crime_data_dto.location = Location.Location(30.96495103, 76.48939133)
        # crime_data_dto.timestamp = time.time()
        # crime_data_dto.url_link = "http://www.yahoo.com"
        # return_list.append(crime_data_dto)
        #
        # crime_data_dto = CrimeDTO.CrimeDTO()
        # crime_data_dto.type = "Other"
        # crime_data_dto.fir_no = "0003"
        # crime_data_dto.location = Location.Location(30.93359301, 76.47153854)
        # crime_data_dto.timestamp = time.time()
        # crime_data_dto.url_link = "http://www.time.com"
        # return_list.append(crime_data_dto)
        #
        # crime_data_dto = CrimeDTO.CrimeDTO()
        # crime_data_dto.type = "Thievery"
        # crime_data_dto.fir_no = "0004"
        # crime_data_dto.location = Location.Location(30.9996831, 76.55118942)
        # crime_data_dto.timestamp = time.time()
        # crime_data_dto.url_link = "http://www.theatlantic.com"
        # return_list.append(crime_data_dto)
        #
        # crime_data_dto = CrimeDTO.CrimeDTO()
        # crime_data_dto.type = "Vehicular Accident"
        # crime_data_dto.fir_no = "0005"
        # crime_data_dto.location = Location.Location(30.98172996, 76.53470993)
        # crime_data_dto.timestamp = time.time()
        # crime_data_dto.url_link = "http://www.bing.com"
        # return_list.append(crime_data_dto)

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
            crime_data_dto.fir_no = "\"" + str(each.fir_number) + "\""
            crime_data_dto.location = each.location
            crime_data_dto.timestamp = each.timestamp.strftime("%d %B, %Y %H:%M:%S")
            crime_data_dto.url_link = "http://www.zipnet.in"
            return_list.append(crime_data_dto)

        return return_list
