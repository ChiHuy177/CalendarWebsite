namespace CalendarWebsite.Server.Models;


// Query DTOs
public class EventQueryRequestDto
{
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public List<string>? Categories { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public long? CreatorId { get; set; }
    public bool? IncludeAttending { get; set; } = true; // Include events user is attending
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}