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

        # Dummy Data
        crimeData1 = CrimeDTO.CrimeDTO()
        crimeData1.type = "Mobile"
        crimeData1.fir_no = "0001"
        crimeData1.location = Location.Location(30.97069152, 76.5583992)
        crimeData1.timestamp = time.time()
        crimeData1.url_link = "http://www.google.com"

        crimeData2 = CrimeDTO.CrimeDTO()
        crimeData2.type = "Mobile"
        crimeData2.fir_no = "0002"
        crimeData2.location = Location.Location(30.96495103, 76.48939133)
        crimeData2.timestamp = time.time()
        crimeData2.url_link = "http://www.yahoo.com"

        crimeData3 = CrimeDTO.CrimeDTO()
        crimeData3.type = "Other"
        crimeData3.fir_no = "0003"
        crimeData3.location = Location.Location(30.93359301, 76.47153854)
        crimeData3.timestamp = time.time()
        crimeData3.url_link = "http://www.time.com"

        crimeData4 = CrimeDTO.CrimeDTO()
        crimeData4.type = "Thievery"
        crimeData4.fir_no = "0004"
        crimeData4.location = Location.Location(30.9996831, 76.55118942)
        crimeData4.timestamp = time.time()
        crimeData4.url_link = "http://www.theatlantic.com"

        crimeData5 = CrimeDTO.CrimeDTO()
        crimeData5.type = "Vehicular Accident"
        crimeData5.fir_no = "0005"
        crimeData5.location = Location.Location(30.98172996, 76.53470993)
        crimeData5.timestamp = time.time()
        crimeData5.url_link = "http://www.bing.com"

        return_list = [crimeData1, crimeData2, crimeData3, crimeData4, crimeData5]
        # return_list = random.sample(return_list, 2)
        return return_list
