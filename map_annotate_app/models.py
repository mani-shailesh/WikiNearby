"""
This is the C{models.py} file for C{map_annotate_app}.
This encodes the data entities used in the project..
"""

from __future__ import unicode_literals

from django.db import models


class CrimeType(models.Model):
    """
    Refers to the type of a crime.
    """

    crime_type = models.CharField(max_length=45, unique=True)

    def __unicode__(self):
        return self.crime_type


class Location(models.Model):
    """
    Stores a location on the map in the form of a latitude-longitude pair.
    """

    name = models.CharField(max_length=255, unique=True)
    lat = models.FloatField()
    lng = models.FloatField()

    def __unicode__(self):
        return self.name


class Crime(models.Model):
    """
    The C{model} of a crime.
    """

    timestamp = models.DateTimeField()
    fir_number = models.CharField(max_length=10)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    type = models.ForeignKey(CrimeType, on_delete=models.SET_NULL, null=True)

    def __unicode__(self):
        return self.fir_number


class Sansad(models.Model):
    """
    The C{model} of a crime.
    """

    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    gender = models.CharField(max_length=1)
    party = models.CharField(max_length=45)
    no_of_questions = models.PositiveSmallIntegerField()
    attendance = models.PositiveSmallIntegerField()
    mp_id = models.CharField(max_length=45, unique=True)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)

    def __unicode__(self):
        return self.first_name
