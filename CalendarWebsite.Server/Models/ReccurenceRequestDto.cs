using System.ComponentModel.DataAnnotations;

namespace CalendarWebsite.Server.Models;

public class RecurrenceRequestDto
{
    [Required]
    public string RecurrenceType { get; set; } = string.Empty;

    public int IntervalValue { get; set; } = 1;

    public string? DaysOfWeek { get; set; }

    public DateTimeOffset? EndDate { get; set; }

    public int? MaxOccurrences { get; set; }
}