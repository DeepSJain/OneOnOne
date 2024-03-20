from django.db import models
import random
import string

def generate_authorization():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=128))

class ContactEvent(models.Model):
    contact = models.ForeignKey('users.Contact', on_delete=models.CASCADE, related_name='contact_events')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='contact_events')
    availability = models.ForeignKey('events.Availability', on_delete=models.CASCADE, related_name='contact_events')
    reminded = models.BooleanField(default=False)
    meeting_scheduled = models.BooleanField(default=False)
    meeting_start_time = models.DateTimeField(null=True, blank=True)
    meeting_end_time = models.DateTimeField(null=True, blank=True)
    authorization = models.CharField(max_length=128, default=generate_authorization, unique=True, editable=False)