from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from users.models import CustomUser
from users.serializers import UserSerializer
from rest_framework.decorators import action

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
        
    @action(detail=False, methods=['post'], url_path='change_password')
    def change_password(self, request, *args, **kwargs):
        user = request.user
        
        old_password = request.data.get('old_password', None)
        new_password = request.data.get('new_password', None)
        
        if not old_password or not new_password:
            raise PermissionDenied("Missing old or new password")
        
        if not user.check_password(old_password):
            raise PermissionDenied("Incorrect password")

        if old_password == new_password:
            raise PermissionDenied("Old and new passwords are the same")
        
        user.set_password(new_password)
        user.save()
        user.password = None
        return Response({'status': 'success'})

    @action(detail=False, methods=['post'], url_path='change_username')
    def change_username(self, request, *args, **kwargs):
        user = request.user
        
        new_username = request.data.get('new_username', None)
        
        if not new_username:
            raise PermissionDenied("Missing new username")
        
        if new_username == user.username:
            raise PermissionDenied("New username is the same as the old one")
        
        if CustomUser.objects.filter(username=new_username).exists():
            raise PermissionDenied("Username already exists")
        
        user.username = new_username
        user.save()
        user.password = None
        return Response({'status': 'success'})
    
    @action(detail=False, methods=['post'], url_path='change_email')
    def change_email(self, request, *args, **kwargs):
        user = request.user
        
        new_email = request.data.get('new_email', None)
        
        if not new_email:
            raise PermissionDenied("Missing new email")
        
        if new_email == user.email:
            raise PermissionDenied("New email is the same as the old one")
        
        if CustomUser.objects.filter(email=new_email).exists():
            raise PermissionDenied("Email already exists")
        
        user.email = new_email
        user.save()
        user.password = None
        return Response({'status': 'success'})

    @action(detail=False, methods=['post'], url_path='delete_account')
    def delete_account(self, request, *args, **kwargs):
        user = request.user
        
        password = request.data.get('password', None)
        
        if not password:
            raise PermissionDenied("Missing password")
        
        if not user.check_password(password):
            raise PermissionDenied("Incorrect password")
        
        user.delete()
        user.password = None
        return Response({'status': 'success'})