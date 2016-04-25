"""
This is the `views.py` file for `map_annotate_app`. In the present approach,
`views.get_response()` redirects all data in a `request` to the
`ResponseBuilder` class. The JSON output is returned by `ResponseBuilder.get_response_json()`.
"""

from django.shortcuts import render

import map_annotate_app.ResponseBuilder as ResponseBuilder


def index(request):
    return render(request, 'index.html')


def get_response(request):
    """
    Fetches response JSON as per the request by client.
    `request` referes to the Parameters passed in by the client.
    The JSON output is returned by `ResponseBuilder.get_response_json()`.
    """
    response_builder = ResponseBuilder.ResponseBuilder(request)
    return response_builder.get_response_json()
