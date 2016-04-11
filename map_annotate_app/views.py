from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def get_response(request):
    """
    Fetches response JSON as per the request by client.
    :param request: Parameters passed in by the client.
    :return:
    """
