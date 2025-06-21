using System.ComponentModel.DataAnnotations;
using CalendarWebsite.Server.Models.Enums;

namespace CalendarWebsite.Server.Models;

// Request DTOs
public class CreateEventRequestDto
{
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? Description { get; set; }

    [Required]
    public DateTimeOffset StartTime { get; set; }

    public DateTimeOffset? EndTime { get; set; }

    public bool AllDay { get; set; } = false;

    [StringLength(500)]
    public string? Location { get; set; }

    [StringLength(500)]
    public string? MeetingUrl { get; set; }

    public EventPriority Priority { get; set; } = EventPriority.Medium;

    public EventVisibility Visibility { get; set; } = EventVisibility.Private;

    public List<string> Categories { get; set; } = new();

    public List<long> AttendeeIds { get; set; } = new();

    public RecurrenceRequestDto? Recurrence { get; set; }

    public CompanyEventRequestDto? CompanyDetails { get; set; }
}