import json

import requests

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

        return_list = []

        url = "https://en.wikipedia.org/w/api.php?" + \
              "action=query" + \
              "&list=geosearch" + \
              "&gsradius=" + str(wiki_filter.radius) + \
              "&gslimit=500" + \
              "&gscoord=" + str(wiki_filter.centre.lat) + "|" + str(wiki_filter.centre.lng) + \
              "&format=json"

        response = requests.get(url)
        if response.ok:
            json_dict = json.loads(response.content)
            article_dict_array = json_dict['query']['geosearch']
            for article_dict in article_dict_array:
                wiki_dto = WikiInfoDTO.WikiInfoDTO()
                wiki_dto.location = Location.Location(article_dict['lat'], article_dict['lon'])
                wiki_dto.title = article_dict['title']
                wiki_dto.link = "https://en.wikipedia.org/?curid=" + str(article_dict['pageid'])
                # TODO: Fetch info of page
                wiki_dto.info = "This is some sample info...."
                return_list.append(wiki_dto)
        else:
            pass

        # https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&pageids=PAGEID

        return return_list
