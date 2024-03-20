"""
URL configuration for OneOnOne project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static

from users.views import UserViewSet, ContactViewSet
from events.views import EventViewSet, ContactEventViewSet, TimeSlotUserViewSet, TimeSlotContactViewSet, GenerateMeetings, SendReminder, SetMeeting
from frontend.views import fromend_urls


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'events', EventViewSet, basename='event')
router.register(r'events/(?P<event_id>\d+)/availability', TimeSlotUserViewSet, basename='availability')
router.register(r'events/(?P<event_id>\d+)', GenerateMeetings, basename='generate_meetings')
router.register(r'event_contacts', ContactEventViewSet, basename='contact_event')
router.register(r'event_contacts/(?P<contact_event_id>\d+)/availability', TimeSlotContactViewSet, basename='contact_availability')
router.register(r'event_contacts/(?P<contact_event_id>\d+)', SendReminder, basename='send_reminder')
router.register(r'event_contacts/(?P<contact_event_id>\d+)', SetMeeting, basename='send_reminder')

urlpatterns = [
    # path("admin/", admin.site.urls, name="admin"),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/', include(router.urls)),

] + fromend_urls + static("image_dir/", document_root="users/image_dir") + static("static/", document_root="../../../frontend")