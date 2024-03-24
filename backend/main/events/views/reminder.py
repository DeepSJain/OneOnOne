from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import action
from rest_framework import viewsets
from events.models import ContactEvent
from django.core.mail import send_mail
from rest_framework.response import Response

from django.conf import settings


class SendReminder(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'], url_path='send_reminder')
    def post(self, request, *args, **kwargs):
        contact_event_id = kwargs.get('contact_event_id', None)
        if not contact_event_id:
            raise NotFound("Contact Event ID not provided")
        
        contact_event = ContactEvent.objects.get(id=contact_event_id)
        if contact_event.event.user.id != request.user.id:
            raise PermissionDenied("Not your event")
        
        if contact_event.reminded:
            raise PermissionDenied("Already reminded")
        
        try:
            send_mail("Reminder", f"""This is a reminder to add your availability for the upcoming event by {contact_event.event.deadline}.
You can do so by visiting the following link: {settings.FRONTEND_URL}/set_availability/?id={contact_event.id}&event_id={contact_event.event.id}&authorization={contact_event.authorization}""", None, [contact_event.contact.email])
        except:
            raise PermissionDenied("Failed to send reminder email")
        
        contact_event.reminded = True
        contact_event.save()
        
        return Response({"status": "success", "message": "Reminder sent"})