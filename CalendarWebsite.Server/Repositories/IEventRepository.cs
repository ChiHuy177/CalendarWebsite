using CalendarWebsite.Server.Models;

namespace CalendarWebsite.Server.Repositories;

public interface IEventRepository
{
    Task<List<Event>> GetEventsAsync(long userId, DateTimeOffset start, DateTimeOffset end);
}