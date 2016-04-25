#!/usr/bin/env python

"""
This is the `manage.py` file for `map_annotate`.
"""

import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "map_annotate.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
