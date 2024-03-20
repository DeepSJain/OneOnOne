from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from users.models import CustomUser
from users.serializers import UserSerializer

# @api_view(['POST'])
# def register(request):
#     gamma = UserRegistrationSerializer(data=request.data)
#     if not gamma.is_valid():
#         return Response(status=400)
#     gamma.save()
#     return Response(status=201)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    
    def get_permissions(self):
        return [] if self.action == 'create' else [IsAuthenticated()]
    
    def get_queryset(self):
        users = CustomUser.objects.filter(id=self.request.user.id)
        for user in users:
            user.password = None
        return users
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self.get_queryset().filter(id=instance.id).exists():
            raise PermissionDenied("Not your event")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        username = serializer.validated_data.get('username', None)
        if not username or CustomUser.objects.filter(username=username).exists():
            raise PermissionDenied("Username already exists")
        serializer.save()
        serializer.instance.password = None
        
    def perform_update(self, serializer):
        if self.request.user.id != serializer.instance.id:
            raise PermissionDenied("Not your user")
        
        username = serializer.validated_data.get('username', None)
        if username and username != serializer.instance.username and CustomUser.objects.filter(username=username).exists():
            raise PermissionDenied("Username taken")
        
        serializer.save()
        serializer.instance.password = None
    
    def perform_destroy(self, instance):
        if self.request.user.id != instance.id:
            raise PermissionDenied("Not your user")
        instance.delete()
        instance.password = None