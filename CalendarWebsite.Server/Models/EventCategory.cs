using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalendarWebsite.Server.Models;

public class EventCategory
{
    [Key, Column(Order = 0)]
    public long EventId { get; set; }

    [Key, Column(Order = 1)]
    [StringLength(50)]
    public string Category { get; set; } = string.Empty;

    // Navigation property
    [ForeignKey("EventId")]
    public virtual Event Event { get; set; } = null!;
}