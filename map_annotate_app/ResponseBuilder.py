class ResponseBuilder:
    """
    Class to build the JSON response to be sent to client.
    """

    def __init__(self, request):
        """
        Initializes the appropriate class variables and filters.
        :param request: Request sent by the client
        """
        pass

    def get_crimes(self):
        """
        Helper method to get a list of `Crime` objects which satisfy the filter.
        :return: List of ``
        """
        pass

    def get_wiki_info(self):
        """
        Helper method to get a list of `WikiInfo` objects which satisfy the filter.
        :return:
        """
        pass

    def get_legislators(self):
        """
        Helper method to get a list of `Legislator` objects which satisfy the filter.
        :return:
        """
        pass

    def get_response_dict(self):
        """
        Processes the request and returns the appropriate response dictionary
        containing key value pairs which satisfy filters.
        :return:
        """
        pass