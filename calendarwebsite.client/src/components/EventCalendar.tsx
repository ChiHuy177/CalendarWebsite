import { useEffect, useState, useRef } from 'react';
import { EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { fetchEvents } from '../services/eventService';
import Calendar from './Calendar';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './loading-spinner';

interface EventCalendarProps {
  userId: number;
}

const EventCalendar = ({ userId }: EventCalendarProps) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const calendarRef = useRef<FullCalendar>(null);
  const { t } = useTranslation();

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Calculate start and end dates based on current month/year
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      
      const fetchedEvents = await fetchEvents(userId, startDate, endDate);
      
      // Transform server events to FullCalendar format
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
          // Add any other properties needed for rendering
        }
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date range changes when navigating the calendar
  const handleDateRangeChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  useEffect(() => {
    loadEvents();
  }, [userId, currentMonth, currentYear]);

  return (
    <div className="event-calendar-container">
      {loading && <LoadingSpinner size="medium" fullScreen={false} text={t('calendar.loading')} />}
      <Calendar 
        events={events} 
        calendarRef={calendarRef}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
};

export default EventCalendar;