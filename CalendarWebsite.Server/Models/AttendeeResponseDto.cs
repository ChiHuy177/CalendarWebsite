namespace CalendarWebsite.Server.Models;


public class AttendeeResponseDto
{
    public long UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public DateTimeOffset? RespondedAt { get; set; }
}