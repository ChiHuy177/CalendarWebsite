namespace CalendarWebsite.Server.Models;

public class CompanyEventRequestDto
{
    public long? DepartmentId { get; set; }

    public string? EventType { get; set; }

    public bool IsMandatory { get; set; } = false;

    public decimal? Budget { get; set; }
}