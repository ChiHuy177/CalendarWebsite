using CalendarWebsite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CalendarWebsite.Server.Data
{
    public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
    {
        public DbSet<DetailAttendance> Attendances { get; set; }
        public DbSet<PersonalProfile> Users { get; set; }
        public DbSet<CustomUserInfo> CustomUserInfos { get; set; }
        public DbSet<DetailAttendanceDTOExcel> DetailAttendancesDtoExcel { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<CustomWorkingTime> CustomWorkingTimes { get; set; }
        public DbSet<WorkWeek> WorkWeeks { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventCategory> EventCategories { get; set; }
        public DbSet<EventAttendee> EventAttendees { get; set; }
        public DbSet<EventRecurrence> EventRecurrence { get; set; }
        public DbSet<CompanyEventDetail> CompanyEventDetails { get; set; }
        public DbSet<PersonalProfile> PersonalProfiles { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DetailAttendanceDTOExcel>().HasNoKey();
            modelBuilder.Entity<EventCategory>()
                .HasKey(ec => new { ec.EventId, ec.Category });

            modelBuilder.Entity<EventAttendee>()
                .HasKey(ea => new { ea.EventId, ea.UserId });
        }
        
    }
}
