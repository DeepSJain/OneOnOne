from django.db import models
from django.conf import settings

class Event(models.Model):
    name = models.CharField(max_length=50)
    deadline = models.DateTimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    availability = models.ForeignKey('events.Availability', on_delete=models.CASCADE, related_name='events')