using System.ComponentModel.DataAnnotations;

namespace CalendarWebsite.Server.Models;

public class UpdateEventRequestDto : CreateEventRequestDto
{
    [Required]
    public long EventId { get; set; }
        
    public string Status { get; set; } = "confirmed";
}