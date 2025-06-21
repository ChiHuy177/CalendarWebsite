using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalendarWebsite.Server.Models;

public class CompanyEventDetail
{
    [Key]
    public long EventId { get; set; }

    public long? DepartmentId { get; set; }

    [StringLength(30)]
    public string? EventType { get; set; }

    public bool IsMandatory { get; set; } = false;

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Budget { get; set; }

    // Navigation properties
    [ForeignKey("EventId")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("DepartmentId")]
    public virtual Department? Department { get; set; }
}