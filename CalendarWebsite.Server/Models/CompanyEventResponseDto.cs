namespace CalendarWebsite.Server.Models;

public class CompanyEventResponseDto
{
    public long? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? EventType { get; set; }
    public bool IsMandatory { get; set; }
    public decimal? Budget { get; set; }
}
