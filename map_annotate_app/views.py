"""
This is the C{views.py} file for C{map_annotate_app}. In the present approach,
C{views.get_response()} redirects all data in a C{request} to the
C{ResponseBuilder} class. The JSON output is returned by C{ResponseBuilder.get_response_json()}.
"""

from django.shortcuts import render

import map_annotate_app.ResponseBuilder as ResponseBuilder


def index(request):
    return render(request, 'index.html')


def get_response(request):
    """
    Fetches response JSON as per the request by client.
    C{request} referes to the Parameters passed in by the client.
    The JSON output is returned by C{ResponseBuilder.get_response_json()}.
    """
    response_builder = ResponseBuilder.ResponseBuilder(request)
    return response_builder.get_response_json()
