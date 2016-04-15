from __future__ import unicode_literals

from django.db import models


class Crime(models.Model):
    timestamp = models.DateTimeField()
    fir_number = models.CharField(max_length=10)
    location_id = models.ForeignKey(Location, on_delete=models.PROTECT, on_update=models.CASCADE)
    type_id = models.ForeignKey(CrimeType, on_delete=models.SET_NULL, on_update=models.CASCADE)

    def __unicode__(self):
        pass


class CrimeType(models.Model):
    crime_type = models.CharField(max_length=15)

    def __unicode__(self):
        pass


class Location(models.Model):
    name = models.CharField(max_length=45)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __unicode__(self):
        pass


class Sansad(models.Model):
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    gender = models.CharField(max_length=1)
    party = models.CharField(max_length=45)
    no_of_questions = models.PositiveSmallIntegerField()
    attendance = models.PositiveSmallIntegerField()
    mp_id = models.CharField(max_length=45)
    location_id = models.ForeignKey(Location, on_delete=models.PROTECT, on_update=models.CASCADE)

    def __unicode__(self):
        pass
