"""
WSGI config for C{map_annotate} project.

It exposes the WSGI callable as a module-level variable named C{}applicationC{}.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "map_annotate.settings")

application = get_wsgi_application()
