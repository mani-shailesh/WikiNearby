import time

from map_annotate_app.dto import CrimeDTO
from map_annotate_app.extras import Location


class CrimeDAO:
    def __init__(self):
        pass

    # noinspection PyUnusedLocal,PyMethodMayBeStatic
    def get_crime_list(self, crime_filter):
        """
        Gets crimes which fit the filter from database.
        :param crime_filter: `CrimeFilter` object to filter out the crimes
        :return: List of `CrimeDTO` objects which satisfy the `crime_filter`
        """
        # TODO: Add actual implementation

        return_list = []

        # Dummy Data
        crimeData_dto = CrimeDTO.CrimeDTO()
        crimeData_dto.type = "Mobile"
        crimeData_dto.fir_no = "0001"
        crimeData_dto.location = Location.Location(30.97069152, 76.5583992)
        crimeData_dto.timestamp = time.time()
        crimeData_dto.url_link = "http://www.google.com"
        return_list.append(crimeData_dto)

        crimeData_dto = CrimeDTO.CrimeDTO()
        crimeData_dto.type = "Mobile"
        crimeData_dto.fir_no = "0002"
        crimeData_dto.location = Location.Location(30.96495103, 76.48939133)
        crimeData_dto.timestamp = time.time()
        crimeData_dto.url_link = "http://www.yahoo.com"
        return_list.append(crimeData_dto)

        crimeData_dto = CrimeDTO.CrimeDTO()
        crimeData_dto.type = "Other"
        crimeData_dto.fir_no = "0003"
        crimeData_dto.location = Location.Location(30.93359301, 76.47153854)
        crimeData_dto.timestamp = time.time()
        crimeData_dto.url_link = "http://www.time.com"
        return_list.append(crimeData_dto)

        crimeData_dto = CrimeDTO.CrimeDTO()
        crimeData_dto.type = "Thievery"
        crimeData_dto.fir_no = "0004"
        crimeData_dto.location = Location.Location(30.9996831, 76.55118942)
        crimeData_dto.timestamp = time.time()
        crimeData_dto.url_link = "http://www.theatlantic.com"
        return_list.append(crimeData_dto)

        crimeData_dto = CrimeDTO.CrimeDTO()
        crimeData_dto.type = "Vehicular Accident"
        crimeData_dto.fir_no = "0005"
        crimeData_dto.location = Location.Location(30.98172996, 76.53470993)
        crimeData_dto.timestamp = time.time()
        crimeData_dto.url_link = "http://www.bing.com"
        return_list.append(crimeData_dto)

        # return_list = [crimeData1, crimeData2, crimeData3, crimeData4, crimeData5]
        # return_list = random.sample(return_list, 2)
        return return_list
