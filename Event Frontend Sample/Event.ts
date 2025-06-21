export interface Event {
    eventId: number;
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
    categories: string[];
    attendeeCount: number;
    eventType?: string;
    isMandatory: boolean;
    recurrence?: {
      recurrenceType: string;
      intervalValue: number;
      daysOfWeek?: string;
      endDate?: string;
      maxOccurrences?: number;
    };
  }