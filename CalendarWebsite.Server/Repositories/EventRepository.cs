using CalendarWebsite.Server.Data;
using CalendarWebsite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CalendarWebsite.Server.Repositories;

public class EventRepository : GenericRepository<Event>, IEventRepository
{
    public EventRepository(DatabaseContext context) : base(context)
    {
    }

    public async Task<List<Event>> GetEventsAsync(long userId, DateTimeOffset start, DateTimeOffset end)
    {
        return await _context.Events
            .Include(e => e.EventCategories)
            .Include(e => e.EventRecurrence)
            .Include(e => e.EventAttendees)
            .Include(e => e.CompanyEventDetail)
            .Where(e => (e.CreatorId == userId || e.EventAttendees.Any(a => a.UserId == userId))
                        && e.StartTime >= start && (e.EndTime <= end || e.EndTime == null))
            .ToListAsync();
    }
}