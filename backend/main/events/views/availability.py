from rest_framework.response import Response
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import action
from events.models import TimeSlot, Event, ContactEvent
from events.serializers import TimeSlotSerializer

import base64

class AvailibilityModelViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    # mixins.RetrieveModelMixin,
    # mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin
):
    pass


class TimeSlotUserViewSet(AvailibilityModelViewSet):
    serializer_class = TimeSlotSerializer
    
    def get_permissions(self):
        return [] if self.action in ['list', 'retrieve'] else [IsAuthenticated()]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id', None)
        if not event_id:
            raise NotFound("Event ID not provided")
        event = Event.objects.get(id=event_id)
        
        if IsAuthenticated().has_permission(self.request, self) and event.user.id == self.request.user.id:
            availability = event.availability
            return TimeSlot.objects.filter(availability=availability)
        
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
        if contact_event.event.id != event.id or contact_event.id != username:
            raise PermissionDenied("Not your event")
        
        availability = event.availability
        return TimeSlot.objects.filter(availability=availability)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id', None)
        if not event_id:
            raise NotFound("Event ID not provided")
        event = Event.objects.get(id=event_id)
        if self.request.user.id != event.user.id:
            raise PermissionDenied("Not your event")
        
        if serializer.validated_data.get('start_time', None) is None:
            raise PermissionDenied("Start time not provided")
        
        if serializer.validated_data.get('end_time', None) is None:
            raise PermissionDenied("End time not provided")
        
        if serializer.validated_data.get('priority', None) is None:
            raise PermissionDenied("Priority not provided")
        
        if serializer.validated_data.get('start_time', None) >= serializer.validated_data.get('end_time', None):
            raise PermissionDenied("Start time must be before end time")
        
        if (serializer.validated_data.get('priority', None) < 0 or serializer.validated_data.get('priority', None) > 2):
            raise PermissionDenied("Priority must be one of 0, 1, 2")
        
        # Check overlap with existing slots
        timeslots = TimeSlot.objects.filter(availability=event.availability)
        for timeslot in timeslots:
            if serializer.validated_data.get('start_time', None) >= timeslot.start_time and serializer.validated_data.get('start_time', None) < timeslot.end_time:
                raise PermissionDenied("Start time overlaps with existing slot")
            
            if serializer.validated_data.get('end_time', None) > timeslot.start_time and serializer.validated_data.get('end_time', None) <= timeslot.end_time:
                raise PermissionDenied("End time overlaps with existing slot")
        
        # Check multiple of 30 minutes for start and end time
        if serializer.validated_data.get('start_time', None).minute % 30 != 0 or serializer.validated_data.get('start_time', None).second != 0:
            raise PermissionDenied("Start time must be multiple of 30 minutes")
        
        if serializer.validated_data.get('end_time', None).minute % 30 != 0 or serializer.validated_data.get('end_time', None).second != 0:
            raise PermissionDenied("End time must be multiple of 30 minutes")
        
        
        availability = event.availability
        serializer.save(availability=availability)
    
    def perform_destroy(self, instance):
        availability = instance.availability
        event = Event.objects.get(availability=availability)
        if self.request.user.id != event.user.id:
            raise PermissionDenied("Not your event")
        instance.delete()
        

class TimeSlotContactViewSet(AvailibilityModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        contact_event_id = self.kwargs.get('contact_event_id', None)
        if not contact_event_id:
            raise NotFound("Contact event ID not provided")
        contact_event = ContactEvent.objects.get(id=contact_event_id)
        
        if IsAuthenticated().has_permission(self.request, self) and contact_event.event.user.id == self.request.user.id:
            availability = contact_event.availability
            return TimeSlot.objects.filter(availability=availability)
        
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
        
        contact_event_2 = contact_events.first()
        if contact_event_2.id != contact_event.id or contact_event_2.id != username:
            raise PermissionDenied("Not your contact availability")
        
        availability = contact_event.availability
        return TimeSlot.objects.filter(availability=availability)
    
    def perform_create(self, serializer):
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
        
        if contact_event.id != username:
            raise PermissionDenied("Not your contact availability")
        
        if serializer.validated_data.get('start_time', None) is None:
            raise PermissionDenied("Start time not provided")
        
        if serializer.validated_data.get('end_time', None) is None:
            raise PermissionDenied("End time not provided")
        
        if serializer.validated_data.get('priority', None) is None:
            raise PermissionDenied("Priority not provided")
        
        if serializer.validated_data.get('start_time', None) >= serializer.validated_data.get('end_time', None):
            raise PermissionDenied("Start time must be before end time")
        
        if (serializer.validated_data.get('priority', None) < 0 or serializer.validated_data.get('priority', None) > 2):
            raise PermissionDenied("Priority must be one of 0, 1, 2")
        
        # Check overlap with existing slots
        timeslots = TimeSlot.objects.filter(availability=contact_event.availability)
        for timeslot in timeslots:
            if serializer.validated_data.get('start_time', None) >= timeslot.start_time and serializer.validated_data.get('start_time', None) < timeslot.end_time:
                raise PermissionDenied("Start time overlaps with existing slot")
            
            if serializer.validated_data.get('end_time', None) > timeslot.start_time and serializer.validated_data.get('end_time', None) <= timeslot.end_time:
                raise PermissionDenied("End time overlaps with existing slot")
            
        
        availability = contact_event.availability
        serializer.save(availability=availability)
    
    def perform_destroy(self, instance):
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
        if contact_event.availability.id != instance.availability.id or contact_event.id != username:
            raise PermissionDenied("Not your availability")
        
        instance.delete()