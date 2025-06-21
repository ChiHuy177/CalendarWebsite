import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { Event } from './Event';
import { fetchEvents } from './api';

const Calendar = ({ userId }: { userId: number }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      calendarRef.current = new FullCalendar.Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, rrulePlugin],
        initialView: 'dayGridMonth',
        events: async (info, successCallback) => {
          try {
            const fetchedEvents = await fetchEvents(userId, info.start, info.end);
            const calendarEvents = fetchedEvents.map(event => ({
              id: event.eventId.toString(),
              title: event.title,
              start: event.startTime,
              end: event.endTime,
              allDay: event.allDay,
              extendedProps: {
                description: event.description,
                location: event.location,
                meetingUrl: event.meetingUrl,
                priority: event.priority,
                visibility: event.visibility,
                status: event.status,
                categories: event.categories,
                attendeeCount: event.attendeeCount,
                eventType: event.eventType,
                isMandatory: event.isMandatory,
              },
              rrule: event.recurrence ? {
                freq: event.recurrence.recurrenceType.toUpperCase(),
                interval: event.recurrence.intervalValue,
                byweekday: event.recurrence.daysOfWeek
                  ? event.recurrence.daysOfWeek.split(',').map(day => day.toUpperCase().substring(0, 2))
                  : undefined,
                dtstart: event.startTime,
                until: event.recurrence.endDate,
                count: event.recurrence.maxOccurrences,
              } : undefined,
            }));
            successCallback(calendarEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        },
        eventClick: (info) => {
          alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description || 'N/A'}\nLocation: ${info.event.extendedProps.location || 'N/A'}`);
        },
      });
      calendarRef.current.render();
    }

    return () => {
      if (calendarRef.current) {
        calendarRef.current.destroy();
      }
    };
  }, [userId]);

  return <div id="calendar" style={{ height: '600px' }} />;
};

export default Calendar;