from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from events.models import Event, ContactEvent, TimeSlot
from datetime import timedelta, datetime
from django.core.mail import send_mail
import random


def availibility_to_one_hour_slots(availability, id=None):
    slots = []
    availability = TimeSlot.objects.filter(availability=availability)
    availability = availability.values('start_time', 'end_time', 'priority')
    availability = list(availability)
    availability = combine_slots(availability)
    
    for slot in availability:
        start_time = slot["start_time"]
        end_time = slot["end_time"]
        while start_time + timedelta(minutes=60) <= end_time:
            slots.append({
                "id": id,
                "start_time": start_time,
                "end_time": start_time + timedelta(minutes=60),
                "priority": slot["priority"]
            })
            start_time += timedelta(minutes=30)
    
    random.shuffle(slots)
    return slots

def combine_slots(slots):
    combined_slots = []
    slots.sort(key=lambda slot: slot['start_time'])
    for slot in slots:
        if not combined_slots:
            combined_slots.append(slot)
            continue
        if combined_slots[-1]['end_time'] == slot['start_time'] and combined_slots[-1]['priority'] == slot['priority']:
            combined_slots[-1]['end_time'] = slot['end_time']
        else:
            combined_slots.append(slot)
    return combined_slots
        

def greedy_meetings(event, contact_events):
    user_slots = availibility_to_one_hour_slots(event.availability)
    contact_slots = [availibility_to_one_hour_slots(contact_event.availability, contact_event.id) for contact_event in contact_events]
    contact_slots = [i for slots in contact_slots for i in slots]
    
    user_slots.sort(key=lambda slot: slot['priority'], reverse=True)
    contact_slots.sort(key=lambda slot: slot['priority'], reverse=True)
    
    assigned_slots = set()
    assigned_contacts = set()
    
    meetings = []
    
    for user_slot in user_slots:
        if user_slot['start_time'] in assigned_slots:
            continue
        
        for contact_slot in contact_slots:
            if user_slot['start_time'] != contact_slot['start_time']:
                continue
            
            if contact_slot["id"] in assigned_contacts:
                continue
            
            meetings.append({
                'contact_event': contact_slot["id"],
                "start_time": user_slot['start_time'],
                "end_time": user_slot['end_time']
            })
            
            assigned_slots.add(user_slot['start_time'] - timedelta(minutes=30))
            assigned_slots.add(user_slot['start_time'])
            assigned_slots.add(user_slot['start_time'] + timedelta(minutes=30))
            
            assigned_contacts.add(contact_slot["id"])
            break
    
    return meetings



class GenerateMeetings(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='meetings')
    def get(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id', None)
        if not event_id:
            raise NotFound("Event ID not provided")
        event = Event.objects.get(id=event_id)
        if event.user.id != request.user.id:
            raise PermissionDenied("Not your event")

        contact_events = ContactEvent.objects.filter(event=event)

        # meetings = greedy_meetings(event, contact_events)
        meeting_options = [greedy_meetings(event, contact_events) for _ in range(10)]
        meeting_options = sorted(meeting_options, key=lambda x: len(x), reverse=True)
        meetings = meeting_options[0]

        return Response({'status': 'success', 'meetings': meetings})

class SetMeeting(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'], url_path='schedule_meetings')
    def post(self, request, *args, **kwargs):
        contact_event_id = kwargs.get('contact_event_id', None)
        if not contact_event_id:
            raise NotFound("Contact Event ID not provided")
        contact_event = ContactEvent.objects.get(id=contact_event_id)
        if contact_event.event.user.id != request.user.id:
            raise PermissionDenied("Not your event")

        start_time = request.data.get('start_time', None)
        end_time = request.data.get('end_time', None)

        if not start_time or not end_time:
            raise NotFound("Start time and end time not provided")

        try:
            start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%SZ")
        except:
            try:
                start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            except:
                raise PermissionDenied("Invalid start time or end time")
        try:
            end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%SZ")
        except:
            try:
                end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            except:
                raise PermissionDenied("Invalid start time or end time")

        is_reschedule = contact_event.meeting_scheduled
        if is_reschedule:
            is_changed_timeslot = contact_event.meeting_start_time.replace(tzinfo=None) != start_time.replace(tzinfo=None) or contact_event.meeting_end_time.replace(tzinfo=None) != end_time.replace(tzinfo=None)

            if not is_changed_timeslot:
                return Response({"status": "success", "message": "The meeting has already been scheduled for the given time"})

        try:
            send_mail("Meeting Scheduled", f"""The meeting has been {'re' if is_reschedule else ''}scheduled for the following time: {start_time} to {end_time}""", None, [contact_event.contact.email])
        except:
            raise PermissionDenied("Failed to send meeting scheduled email")

        contact_event.meeting_scheduled = True
        contact_event.meeting_start_time = start_time
        contact_event.meeting_end_time = end_time
        contact_event.save()

        return Response({"status": "success", "message": f"Meeting {'re' if is_reschedule else ''}scheduled"})