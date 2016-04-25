"""
For more details, see the class documentation.
"""

import json

import requests

from map_annotate_app.dto import WikiInfoDTO
from map_annotate_app.extras import Location


class WikiInfoDAO:
    """
    This class represents the data access layer for a Wikipedia article.
    """

    def __init__(self):
        """
        No need to initialize anything.
        """
        pass

    @staticmethod
    def get_wiki_info_list(wiki_filter):
        """
        Gets crimes which fit the filter from database.
        C{wiki_filter} is a C{WikiInfoFilter} object to filter out the wiki articles.
        This returns a list of C{WikiInfoDTO} objects which satisfy the C{wiki_filter}.
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
                wiki_dto.info = ""
                wiki_dto.pageid = str(article_dict['pageid'])
                return_list.append(wiki_dto)

        else:
            pass

        return return_list
