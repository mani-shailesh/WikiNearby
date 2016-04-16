from map_annotate_app.dto import WikiInfoDTO
from map_annotate_app.extras import Location


class WikiInfoDAO:
    def __init__(self):
        pass

    # noinspection PyUnusedLocal,PyMethodMayBeStatic
    def get_wiki_info_list(self, wiki_filter):
        """
        Gets crimes which fit the filter from database.
        :param wiki_filter: `WikiInfoFilter` object to filter out the wiki articles
        :return: List of `WikiInfoDTO` objects which satisfy the `wiki_filter`
        """
        # TODO
        # https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gslimit=500&gscoord=28.6139|77.2090&format=json
        # https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=India

        return_list = []

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(30.9755, 76.5395)
        wiki_dto.title = "Indian Institue of Technology Ropar"
        wiki_dto.link = "https://en.wikipedia.org/?curid=19859118"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(30.9664, 76.5331)
        wiki_dto.title = "Rupnagar"
        wiki_dto.link = "https://en.wikipedia.org/?curid=3677968"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(30.96639, 76.53306)
        wiki_dto.title = "Rayat Institute of Engineering & Information Technology"
        wiki_dto.link = "https://en.wikipedia.org/?curid=2211767"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(30.97, 76.51)
        wiki_dto.title = "Rupnagar district"
        wiki_dto.link = "https://en.wikipedia.org/?curid=4444855"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(31.02, 76.5)
        wiki_dto.title = "Ropar Wetland"
        wiki_dto.link = "https://en.wikipedia.org/?curid=20093038"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        wiki_dto = WikiInfoDTO.WikiInfoDTO()
        wiki_dto.location = Location.Location(31.0392, 76.576)
        wiki_dto.title = "Nehon"
        wiki_dto.link = "https://en.wikipedia.org/?curid=5804255"
        wiki_dto.info = "This is some sample info...."
        return_list.append(wiki_dto)

        # return_list = random.sample(return_list, 4)
        return return_list
