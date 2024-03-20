from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from users.models import Contact
from events.models import ContactEvent
from users.serializers import ContactSerializer

import base64

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    
    def get_permissions(self):
        return [] if self.action in ['list', 'retrieve'] else [IsAuthenticated()]
    
    def get_queryset(self):
        if IsAuthenticated().has_permission(self.request, self):
            return Contact.objects.filter(user=self.request.user)
        
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
            raise PermissionDenied("Not your contact")
        
        return Contact.objects.filter(id=contact_event.contact.id)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.get_queryset().filter(id=instance.id).exists():
            raise PermissionDenied("Not your event")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        contact = Contact.objects.filter(email=serializer.validated_data['email'], user=self.request.user)
        if contact.exists():
            raise PermissionDenied("Contact already exists")
        
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        if self.request.user.id != serializer.instance.user.id:
            raise PermissionDenied("Not your contact")
        serializer.save()
    
    def perform_destroy(self, instance):
        if self.request.user.id != instance.user.id:
            raise PermissionDenied("Not your contact")
        instance.delete()