from django.shortcuts import render
from django.urls import path

def index(request):
    return render(request, "base.html", {
        "title": "1on1",
        "js_files": [
            "swiper.js",
            "elements/index.js"
        ],
        "css_files": [
            "swiper.css",
            "index.css"
        ],
        "url_params": {}
    })
    
def confirmation(request):
    return render(request, "base.html", {
        "title": "Confirmation",
        "js_files": ["elements/confirmation.js"],
        "css_files": [],
        "url_params": {}
    })
    
def home(request):
    return render(request, "base.html", {
        "title": "Home",
        "js_files": ["elements/home.js"],
        "css_files": [],
        "url_params": {}
    })
    
def contacts(request):
    return render(request, "base.html", {
        "title": "Contacts",
        "js_files": ["elements/contacts.js"],
        "css_files": [],
        "url_params": {}
    })

def create_event(request):
    return render(request, "base.html", {
        "title": "Create Event",
        "js_files": ["elements/create_event.js"],
        "css_files": [],
        "url_params": {}
    })

def logout(request):
    return render(request, "base.html", {
        "title": "Logout",
        "js_files": ["elements/logout.js"],
        "css_files": [],
        "url_params": {}
    })

def set_availability(request, event_id):
    return render(request, "base.html", {
        "title": "Set Availability",
        "js_files": ["elements/set_availability.js"],
        "css_files": [],
        "url_params": {
            "event_id": event_id
        }
    })

def set_availability_for_contact(request):
    return render(request, "base.html", {
        "title": "Set Availability",
        "js_files": ["elements/set_availability_for_contact.js"],
        "css_files": [],
        "url_params": {}
    })

def invite_contacts(request, event_id):
    return render(request, "base.html", {
        "title": "Invite Contacts",
        "js_files": ["elements/invite_contacts.js"],
        "css_files": [],
        "url_params": {
            "event_id": event_id
        }
    })

def event(request, event_id):
    return render(request, "base.html", {
        "title": "Event",
        "js_files": ["elements/event.js"],
        "css_files": [],
        "url_params": {
            "event_id": event_id
        }
    })

def settings(request, event_id):
    return render(request, "base.html", {
        "title": "Event",
        "js_files": ["elements/settings.js"],
        "css_files": [],
        "url_params": {}
    })

fromend_urls = [
    path("", index, name="index"),
    path("confirmation/", confirmation, name="confirmation"),
    path("contacts/", contacts, name="contacts"),
    path("create_event/", create_event, name="create_event"),
    
    path("events/", home, name="home"),
    path("events/<int:event_id>/", event, name="event"),
    path("events/<int:event_id>/set_availability/", set_availability, name="set_availability"),
    path("events/<int:event_id>/invite_contacts/", invite_contacts, name="invite_contacts"),
    
    path("settings/", settings, name="settings"),
    
    path("logout/", logout, name="logout"),
    
    path("set_availability/", set_availability_for_contact, name="set_availability_for_contact" )
]