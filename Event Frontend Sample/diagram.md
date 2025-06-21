erDiagram
    PersonalProfile ||--o{ Events : contains
    PersonalProfile ||--o{ PersonalProfile : manages
    Events ||--|{ CompanyEventDetails : has
    Events ||--|{ EventAttendees : has
    Events ||--|{ EventCategories : has
    Events ||--|{ EventRecurrence : has
    PersonalProfile ||--|{ EventAttendees : attends

    Events {
        int event_id
        int creator_id
        string title
        string description
        datetime start_time
        datetime end_time
        boolean all_day
        string location
        string meeting_url
        int priority
        string visibility
        string status
        datetime created_at
        datetime updated_at
        boolean is_deleted
    }

    PersonalProfile {
        int Id
        int AccountId
        string AccountName
        string Name
        string FullName
        int DepartmentId
        int ManagerId
        int PositionId
        string Gender
        date BirthDay
        string Address
        string StaffId
        date DateOfHire
        string Mobile
        string Email
        string ImageId
        string ImagePath
        string SignatureUserName
        string SignaturePassword
        boolean EnableSignature
        string UserStatus
        string CreatedBy
        datetime CreatedTime
        datetime LastModified
        string ModifiedBy
        boolean IsDeleted
        string SignatureTitle
        string SignatureEmail
        string UserLevel
        string UserPosition
        string SignatureImage
        boolean IsDarkMode
        string FlashSignatureImage
        string Lang
        string CoverImageId
        string CoverImagePath
        string ThumbnailImageId
        string ThumbnailImagePath
        boolean EnableEmail
        boolean EnableNotification
        boolean CalendarChecked
        string CalendarColor
        boolean DailyView
        boolean MonthlyView
        boolean WeeklyView
        boolean CalendarResourceSelected
        string SubDepartmentIds
        string CalendarUserFillter
        boolean IsSyncCalendar
        boolean TwoFactorEnabled
        datetime LastPasswordChanged
        boolean AuthorizeAutomaticDigitalSigningEnabled
        boolean CalendarResourceChecked
        string InternalPhone
        boolean IsAllowedToUseTheCompanysDigitalSignature
        boolean ShowEventTheme
    }

    CompanyEventDetails {
        int event_id
        int department_id
        string event_type
        boolean is_mandatory
        float budget
    }

    EventAttendees {
        int event_id
        int user_id
        string role
        string response
        datetime responded_at
    }

    EventCategories {
        int event_id
        string category
    }

    EventRecurrence {
        int event_id
        string recurrence_type
        int interval_value
        string days_of_week
        date end_date
        int max_occurrences
    }
