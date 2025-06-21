namespace CalendarWebsite.Server.Models;

public class EventResponseDto
{
    public long EventId { get; set; }
    public long CreatorId { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public bool AllDay { get; set; }
    public string? Location { get; set; }
    public string? MeetingUrl { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string Visibility { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<string> Categories { get; set; } = new();
    public List<AttendeeResponseDto> Attendees { get; set; } = new();
    public RecurrenceResponseDto? Recurrence { get; set; }
    public CompanyEventResponseDto? CompanyDetails { get; set; }
}