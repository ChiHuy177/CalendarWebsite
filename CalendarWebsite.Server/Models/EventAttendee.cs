using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CalendarWebsite.Server.Models.Enums;

namespace CalendarWebsite.Server.Models;

public class EventAttendee
{
    [Key, Column(Order = 0)]
    public long EventId { get; set; }

    [Key, Column(Order = 1)]
    public long UserId { get; set; }

    [StringLength(15)] public AttendeeRole Role { get; set; } = AttendeeRole.Attendee;

    [StringLength(15)] public AttendeeResponse Response { get; set; } = AttendeeResponse.Pending;

    public DateTimeOffset? RespondedAt { get; set; }

    // Navigation properties
    [ForeignKey("EventId")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserId")]
    public virtual PersonalProfile User { get; set; } = null!;
}