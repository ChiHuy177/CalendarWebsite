using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalendarWebsite.Server.Models;


    public class Event
    {
        [Key]
        public long EventId { get; set; }

        [Required]
        public long CreatorId { get; set; }

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

        [StringLength(10)]
        public string Priority { get; set; } = "medium";

        [StringLength(10)]
        public string Visibility { get; set; } = "private";

        [StringLength(15)]
        public string Status { get; set; } = "confirmed";

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;
        
        public bool IsDeleted { get; set; } = false;

        // Navigation properties
        [ForeignKey("CreatorId")]
        public virtual PersonalProfile Creator { get; set; } = null!;

        public virtual ICollection<EventCategory> EventCategories { get; set; } = new List<EventCategory>();
        public virtual ICollection<EventAttendee> EventAttendees { get; set; } = new List<EventAttendee>();
        public virtual EventRecurrence? EventRecurrence { get; set; }
        public virtual CompanyEventDetail? CompanyEventDetail { get; set; }
    
}