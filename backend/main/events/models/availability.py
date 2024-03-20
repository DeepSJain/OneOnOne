from django.db import models

class Availability(models.Model):
    id = models.AutoField(primary_key=True)

class TimeSlot(models.Model):
    availability = models.ForeignKey('events.Availability', on_delete=models.CASCADE, related_name='time_slots')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    priority = models.IntegerField(default=1)