using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalendarWebsite.Server.Models;

public class EventRecurrence
{
    [Key]
    public long EventId { get; set; }

    [Required]
    [StringLength(15)]
    public string RecurrenceType { get; set; } = string.Empty;

    public int IntervalValue { get; set; } = 1;

    [StringLength(20)]
    public string? DaysOfWeek { get; set; }

    public DateTimeOffset? EndDate { get; set; }

    public int? MaxOccurrences { get; set; }

    // Navigation property
    [ForeignKey("EventId")]
    public virtual Event Event { get; set; } = null!;
}