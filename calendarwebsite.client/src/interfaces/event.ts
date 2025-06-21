export interface EventRecurrence {
  recurrenceType: string;
  intervalValue: number;
  daysOfWeek?: string;
  endDate?: string;
  maxOccurrences?: number;
}

export interface Event {
  eventId: number;
  creatorId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  meetingUrl?: string;
  priority: string;
  visibility: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  categories: string[];
  attendeeCount: number;
  eventType?: string;
  isMandatory: boolean;
  recurrence?: EventRecurrence;
}

export interface EventsPageProps {
  userId: number;
}