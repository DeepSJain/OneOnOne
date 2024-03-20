from rest_framework import serializers
from events.models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name', 'deadline')  # 'user'
    
    def create(self, validated_data):
        return Event.objects.create(**validated_data)