using System.ComponentModel.DataAnnotations;
using CalendarWebsite.Server.Models.Enums;

namespace CalendarWebsite.Server.Models;

public class AttendeeResponseRequestDto
{
    [Required]
    public long EventId { get; set; }

    [Required]
    public AttendeeResponse Response { get; set; } = AttendeeResponse.Pending; // "accepted", "declined", "tentative"
}