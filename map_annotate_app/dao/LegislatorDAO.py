from map_annotate_app.dto import LegislatorDTO
from map_annotate_app.extras import Location


class LegislatorDAO:
    def __init__(self):
        pass

    def get_legislator_list(self, legislator_filter):
        """
        Gets crimes which fit the filter from database.
        :param legislator_filter: `LegislatorFilter` object to filter out the crimes
        :return: List of `LegislatorDTO` objects which satisfy the `crime_filter`
        """
        # TODO

        return_list = []

        legislator_dto = LegislatorDTO.LegislatorDTO()
        legislator_dto.location = Location.Location(30.978, 76.53)
        legislator_dto.first_name = "ABCD"
        legislator_dto.last_name = "EFGH"
        legislator_dto.party = "Party A"
        legislator_dto.no_questions = 0
        return_list.append(legislator_dto)

        legislator_dto = LegislatorDTO.LegislatorDTO()
        legislator_dto.location = Location.Location(30.9664, 76.51)
        legislator_dto.first_name = "Apple"
        legislator_dto.last_name = "Orange"
        legislator_dto.party = "Party B"
        legislator_dto.no_questions = 10
        return_list.append(legislator_dto)

        legislator_dto = LegislatorDTO.LegislatorDTO()
        legislator_dto.location = Location.Location(30.95, 76.53306)
        legislator_dto.first_name = "Banana"
        legislator_dto.last_name = "Banana"
        legislator_dto.party = "Party C"
        legislator_dto.no_questions = 100
        return_list.append(legislator_dto)

        # return_list = random.sample(return_list, 2)
        return return_list
