from rest_framework import serializers
from events.models import ContactEvent

class ContactEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEvent
        fields = ('id', 'event', 'contact', 'reminded', 'meeting_scheduled', 'meeting_start_time', 'meeting_end_time', 'authorization')
    
    def create(self, validated_data):
        return ContactEvent.objects.create(**validated_data)