namespace CalendarWebsite.Server.Models;

public class EventListResponse
{
    public List<EventResponseDto> Events { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}