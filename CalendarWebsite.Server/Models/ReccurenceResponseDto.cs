namespace CalendarWebsite.Server.Models;

public class RecurrenceResponseDto
{
    public string RecurrenceType { get; set; } = string.Empty;
    public int IntervalValue { get; set; }
    public string? DaysOfWeek { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public int? MaxOccurrences { get; set; }
}