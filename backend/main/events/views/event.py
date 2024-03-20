from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import action
from events.models import Event, Availability, ContactEvent, TimeSlot
from events.serializers import EventSerializer

from django.utils import timezone
import base64


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    
    def get_permissions(self):
        return [] if self.action in ['list', 'retrieve'] else [IsAuthenticated()]
    
    def get_queryset(self):
        if IsAuthenticated().has_permission(self.request, self):
            return Event.objects.filter(user=self.request.user)
        
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
            raise PermissionDenied("Not your event")
        
        return Event.objects.filter(id=contact_event.event.id)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.get_queryset().filter(id=instance.id).exists():
            raise PermissionDenied("Not your event")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        deadline = serializer.validated_data.get('deadline')
        if deadline < timezone.now():
            raise PermissionDenied("Deadline cannot be in the past")
        
        availability = Availability.objects.create()
        serializer.save(user=self.request.user, availability=availability)
        
    
    def perform_update(self, serializer):
        if(self.request.user.id != serializer.instance.user.id):
            raise PermissionDenied("Not your event")
        serializer.save()
    
    def perform_destroy(self, instance):
        if self.request.user.id != instance.user.id:
            raise PermissionDenied("Not your event")
        instance.delete()
    
    def get_event_details(self, event):
        data = {
            'id': event.id,
            'name': event.name,
            'deadline': event.deadline,
        }
        
        contact_events = ContactEvent.objects.filter(event=event)
        data['contacts'] = [{
            "id": contact_event.id,
            "name": contact_event.contact.name,
            "email": contact_event.contact.email,
            "meeting_scheduled": contact_event.meeting_scheduled,
            "meeting_start_time": contact_event.meeting_start_time,
            "meeting_end_time": contact_event.meeting_end_time,
            "reminded": contact_event.reminded,
            "availability_set": TimeSlot.objects.filter(availability=contact_event.availability).exists(),
        } for contact_event in contact_events]
        
        time_slots = TimeSlot.objects.filter(availability=event.availability)
        data['time_slots'] = [{
            "id": time_slot.id,
            "start_time": time_slot.start_time,
            "end_time": time_slot.end_time,
            "priority": time_slot.priority,
        } for time_slot in time_slots]
        
        return data
    
    @action(detail=False, methods=['get'], url_path='details')
    def details(self, request, *args, **kwargs):
        events = self.get_queryset()
        data = [self.get_event_details(event) for event in events]
        
        return Response({'status': 'success', 'events': data})