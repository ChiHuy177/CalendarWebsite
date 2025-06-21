using CalendarWebsite.Server.Models;

namespace CalendarWebsite.Server.Services;

public interface IEventService
{
    Task<List<EventDto>> GetEventsAsync(long userId, DateTime start, DateTime end);
}