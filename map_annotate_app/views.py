from django.shortcuts import render

import map_annotate_app.classes.ResponseBuilder as ResponseBuilder


def index(request):
    return render(request, 'index.html')


def get_response(request):
    """
    Fetches response JSON as per the request by client.
    :param request: Parameters passed in by the client.
    :return:
    """
    response_builder = ResponseBuilder.ResponseBuilder(request)
    return response_builder.get_response()
