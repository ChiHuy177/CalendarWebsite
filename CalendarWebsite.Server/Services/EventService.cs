using CalendarWebsite.Server.Models;
using CalendarWebsite.Server.Repositories;

namespace CalendarWebsite.Server.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<EventDto>> GetEventsAsync(long userId, DateTime start, DateTime end)
    {
        var events = await _eventRepository.GetEventsAsync(userId, start, end);
        return events.Select(e => new EventDto
        {
            EventId = e.EventId,
            Title = e.Title,
            Description = e.Description,
            StartTime = e.StartTime,
            EndTime = e.EndTime,
            AllDay = e.AllDay,
            Location = e.Location,
            MeetingUrl = e.MeetingUrl,
            Priority = e.Priority,
            Visibility = e.Visibility,
            Status = e.Status,
            Categories = e.EventCategories?.Select(ec => ec.Category).ToList() ?? new List<string>(),
            AttendeeCount = e.EventAttendees?.Count ?? 0,
            EventType = e.CompanyEventDetail?.EventType,
            IsMandatory = e.CompanyEventDetail?.IsMandatory ?? false,
            Recurrence = e.EventRecurrence != null ? new RecurrenceDto
            {
                RecurrenceType = e.EventRecurrence.RecurrenceType,
                IntervalValue = e.EventRecurrence.IntervalValue,
                DaysOfWeek = e.EventRecurrence.DaysOfWeek,
                EndDate = e.EventRecurrence.EndDate,
                MaxOccurrences = e.EventRecurrence.MaxOccurrences
            } : null
        }).ToList();
    }
}
