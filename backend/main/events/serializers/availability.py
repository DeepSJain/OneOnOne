from rest_framework import serializers
from events.models import TimeSlot

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'start_time', 'end_time', 'priority')

    def create(self, validated_data):
        return TimeSlot.objects.create(**validated_data)