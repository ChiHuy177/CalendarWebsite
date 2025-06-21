namespace CalendarWebsite.Server.Models;

public class EventDto
{
    public long EventId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public bool AllDay { get; set; }
    public string? Location { get; set; }
    public string? MeetingUrl { get; set; }
    public string Priority { get; set; }
    public string Visibility { get; set; }
    public string Status { get; set; }
    public List<string> Categories { get; set; }
    public int AttendeeCount { get; set; }
    public string? EventType { get; set; }
    public bool IsMandatory { get; set; }
    public RecurrenceDto? Recurrence { get; set; }
}