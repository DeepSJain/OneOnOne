from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from events.models import Event, ContactEvent, Availability, TimeSlot
from events.serializers import ContactEventSerializer
from django.core.mail import send_mail

import base64


class ContactEventViewSet(viewsets.ModelViewSet):
    serializer_class = ContactEventSerializer
    
    def get_permissions(self):
        return [] if self.action in ['list', 'retrieve'] else [IsAuthenticated()]
    
    def get_queryset(self):
        if IsAuthenticated().has_permission(self.request, self):
            if event := self.request.query_params.get('event', None):
                events = Event.objects.filter(user=self.request.user, id=event)
                if not events.exists():
                    raise PermissionDenied("Event not found")
            else:
                events = Event.objects.filter(user=self.request.user)
            return ContactEvent.objects.filter(event__in=events)

        contact_authorization = self.request.headers.get('Authorization', None)
        if not contact_authorization:
            raise PermissionDenied("Authorization header not found")
        contact_authorization = contact_authorization.split(' ')[1]

        try:
            contact_authorization = base64.b64decode(contact_authorization).decode('utf-8')
            username, password = contact_authorization.split(':')
            username = int(username)
        except:
            raise PermissionDenied("Invalid authorization")

        contact_events = ContactEvent.objects.filter(authorization=password)
        if not contact_events.exists():
            raise PermissionDenied("Contact event not found")

        contact_event = contact_events.first()

        if username != contact_event.id:
            raise PermissionDenied("Not your contact event")

        contact_events = ContactEvent.objects.filter(id=contact_event.id)
        for contact_event in contact_events:
            contact_event.authorization = None
        return contact_events
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.get_queryset().filter(id=instance.id).exists():
            raise PermissionDenied("Not your event")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        contact = serializer.validated_data.get('contact')
        if contact.user != self.request.user:
            raise PermissionDenied("Not your contact")
        
        event = serializer.validated_data.get('event')
        if event.user != self.request.user:
            raise PermissionDenied("Not your event")
        
        contact_events = ContactEvent.objects.filter(contact=contact, event=event)
        if contact_events.exists():
            raise PermissionDenied("Contact event already exists")
        
        availability = Availability.objects.create()
        contact_event = serializer.save(availability=availability)
        
        try:
            send_mail("Meeting Invite", f"""You have been invited to a meeting. Please add your availability.
You can do so by visiting the following link: http://localhost:8000/set_availability/?id={contact_event.id}&event_id={contact_event.event.id}&authorization={contact_event.authorization}""", None, [contact_event.contact.email])
        except Exception as e:
            print(e)
            availability.delete()
            contact_event.delete()
            raise PermissionDenied("Failed to send invitation email")
        
        serializer.instance.authorization = None
        
    
    def perform_update(self, serializer):
        if self.request.user.id != serializer.instance.event.user.id:
            raise PermissionDenied("Not your event")
        
        contact = serializer.validated_data.get('contact')
        if contact is not None and contact.user != self.request.user:
            raise PermissionDenied("Not your contact")
        
        event = serializer.validated_data.get('event')
        if event is not None and event.user != self.request.user:
            raise PermissionDenied("Not your event")
        
        serializer.save()
        serializer.instance.authorization = None
    
    def perform_destroy(self, instance):
        if self.request.user.id != instance.event.user.id:
            raise PermissionDenied("Not your event")
        instance.delete()
        instance.authorization = None
    
    def get_contact_event_details(self, contact_event):
        event = Event.objects.get(id=contact_event.event.id)
        contact = contact_event.contact
        availability = Availability.objects.get(id=contact_event.availability.id)
        time_slots = TimeSlot.objects.filter(availability=availability)
        time_slots = [{'start_time': time_slot.start_time, 'end_time': time_slot.end_time, 'priority': time_slot.priority} for time_slot in time_slots]
        return {
            'id': contact_event.id,
            'reminded': contact_event.reminded,
            'meeting_scheduled': contact_event.meeting_scheduled,
            'meeting_start_time': contact_event.meeting_start_time,
            'meeting_end_time': contact_event.meeting_end_time,
            'event': {
                'id': event.id,
                'name': event.name,
            },
            'contact': {
                'id': contact.id,
                'name': contact.name,
                'email': contact.email
            },
            'timeslots': time_slots
        }
    
    @action(detail=True, methods=['get'], url_path='details', url_name='details')
    def with_details(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.get_queryset().filter(id=instance.id).exists():
            raise PermissionDenied("Not your event")
        return Response({'status': 'success', 'contact_event': self.get_contact_event_details(instance)})
    
    @action(detail=False, methods=['get'], url_path='details', url_name='details')
    def with_details_all(self, request, *args, **kwargs):
        event_id = request.query_params.get('event_id', None)
        if not event_id:
            raise PermissionDenied("Event ID not provided")
        
        try:
            event = Event.objects.get(id=event_id)
        except:
            raise PermissionDenied("Event not found")
        
        if event.user.id != request.user.id:
            raise PermissionDenied("Not your event")
        
        contact_events = self.get_queryset().filter(event=event)
        contact_events = [self.get_contact_event_details(contact_event) for contact_event in contact_events]
        return Response({'status': 'success', 'contact_events': contact_events})