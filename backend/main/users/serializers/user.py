from rest_framework import serializers
from users.models.user import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'pfp')
        
    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)