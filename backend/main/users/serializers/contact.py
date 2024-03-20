from rest_framework import serializers
from users.models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'name', 'email')  #  'user'
    
    def create(self, validated_data):
        return Contact.objects.create(**validated_data)