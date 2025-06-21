Use WorkFlow193;

-- Main Events table with soft delete
CREATE TABLE Events (
    event_id bigint PRIMARY KEY IDENTITY(1,1),
    creator_id bigint NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    start_time DATETIME2 NOT NULL,
    end_time DATETIME2,
    all_day BIT DEFAULT 0,
    location NVARCHAR(500), -- Simple text location
    meeting_url NVARCHAR(500), -- For virtual meetings
    priority NVARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    visibility NVARCHAR(10) DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'shared')),
    status NVARCHAR(15) DEFAULT 'confirmed' CHECK (status IN ('tentative', 'confirmed', 'cancelled')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    CONSTRAINT FK_events_users FOREIGN KEY (creator_id) REFERENCES PersonalProfile(Id),
    CONSTRAINT FK_events_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Event categories/tags with soft delete
CREATE TABLE EventCategories (
    event_id bigint NOT NULL,
    category NVARCHAR(50) NOT NULL,
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    PRIMARY KEY (event_id, category),
    CONSTRAINT FK_event_categories_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_event_categories_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Event attendees with soft delete
CREATE TABLE EventAttendees (
    event_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role NVARCHAR(15) DEFAULT 'attendee' CHECK (role IN ('organizer', 'attendee', 'optional')),
    response NVARCHAR(15) DEFAULT 'pending' CHECK (response IN ('pending', 'accepted', 'declined', 'tentative')),
    responded_at DATETIME2,
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    PRIMARY KEY (event_id, user_id),
    CONSTRAINT FK_event_attendees_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_event_attendees_users FOREIGN KEY (user_id) REFERENCES PersonalProfile(Id),
    CONSTRAINT FK_event_attendees_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Event recurrence with soft delete
CREATE TABLE EventRecurrence (
    event_id bigint PRIMARY KEY,
    recurrence_type NVARCHAR(15) NOT NULL CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    interval_value INT DEFAULT 1,
    days_of_week NVARCHAR(20),
    end_date DATETIME2,
    max_occurrences INT,
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    CONSTRAINT FK_event_recurrence_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_event_recurrence_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Event reminders with soft delete
CREATE TABLE EventReminders (
    reminder_id bigint PRIMARY KEY IDENTITY(1,1),
    event_id bigint NOT NULL,
    user_id bigint NOT NULL,
    minutes_before INT NOT NULL,
    reminder_type NVARCHAR(15) DEFAULT 'notification' CHECK (reminder_type IN ('notification', 'email')),
    is_sent BIT DEFAULT 0,
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    CONSTRAINT FK_event_reminders_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_event_reminders_users FOREIGN KEY (user_id) REFERENCES PersonalProfile(Id),
    CONSTRAINT FK_event_reminders_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Company event details with soft delete
CREATE TABLE CompanyEventDetails (
    event_id bigint PRIMARY KEY,
    department_id bigint,
    event_type NVARCHAR(30),
    is_mandatory BIT DEFAULT 0,
    budget DECIMAL(10,2),
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    CONSTRAINT FK_company_events_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_company_events_departments FOREIGN KEY (department_id) REFERENCES Department(Id),
    CONSTRAINT FK_company_events_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Event files with soft delete
CREATE TABLE EventFiles (
    attachment_id bigint PRIMARY KEY IDENTITY(1,1),
    event_id bigint NOT NULL,
    uploaded_by bigint NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    original_file_name NVARCHAR(255),
    file_path NVARCHAR(500),
    file_size bigint,
    mime_type NVARCHAR(100),
    attachment_type NVARCHAR(20) DEFAULT 'file' CHECK (attachment_type IN ('file', 'link', 'image')),
    external_url NVARCHAR(500),
    description NVARCHAR(500),
    is_public BIT DEFAULT 0,
    upload_date DATETIME2 DEFAULT GETDATE(),
    -- Soft delete fields
    is_deleted BIT DEFAULT 0,
    deleted_at DATETIME2 NULL,
    deleted_by bigint NULL,
    CONSTRAINT FK_event_files_events FOREIGN KEY (event_id) REFERENCES Events(event_id),
    CONSTRAINT FK_event_files_users FOREIGN KEY (uploaded_by) REFERENCES PersonalProfile(Id),
    CONSTRAINT FK_event_files_deleted_by FOREIGN KEY (deleted_by) REFERENCES PersonalProfile(Id)
);
GO

-- Update trigger for events
CREATE TRIGGER trg_events_update
ON Events
AFTER UPDATE
AS
BEGIN
    UPDATE Events
    SET updated_at = GETDATE()
    FROM Events e
    INNER JOIN inserted i ON e.event_id = i.event_id;
END;
GO

-- Soft delete procedures for easier management
CREATE PROCEDURE sp_SoftDeleteEvent
    @event_id bigint,
    @deleted_by bigint
AS
BEGIN
    BEGIN TRANSACTION;

    -- Soft delete the main event
    UPDATE Events
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    -- Soft delete related records
    UPDATE EventCategories
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    UPDATE EventAttendees
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    UPDATE EventRecurrence
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    UPDATE EventReminders
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    UPDATE CompanyEventDetails
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    UPDATE EventFiles
    SET is_deleted = 1, deleted_at = GETDATE(), deleted_by = @deleted_by
    WHERE event_id = @event_id AND is_deleted = 0;

    COMMIT TRANSACTION;
END;
GO

-- Restore procedure
CREATE PROCEDURE sp_RestoreEvent
    @event_id bigint
AS
BEGIN
    BEGIN TRANSACTION;

    -- Restore the main event
    UPDATE Events
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    -- Restore related records
    UPDATE EventCategories
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    UPDATE EventAttendees
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    UPDATE EventRecurrence
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    UPDATE EventReminders
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    UPDATE CompanyEventDetails
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    UPDATE EventFiles
    SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL
    WHERE event_id = @event_id AND is_deleted = 1;

    COMMIT TRANSACTION;
END;
GO

-- Views for easier querying of active records
CREATE VIEW vw_ActiveEvents AS
SELECT * FROM Events WHERE is_deleted = 0;
GO

CREATE VIEW vw_ActiveEventAttendees AS
SELECT * FROM EventAttendees WHERE is_deleted = 0;
GO

CREATE VIEW vw_ActiveEventFiles AS
SELECT * FROM EventFiles WHERE is_deleted = 0;
GO

-- Indexes for performance (including soft delete fields)
CREATE INDEX IX_events_creator_start_time_active ON Events(creator_id, start_time) WHERE is_deleted = 0;
CREATE INDEX IX_events_start_time_active ON Events(start_time) WHERE is_deleted = 0;
CREATE INDEX IX_events_is_deleted ON Events(is_deleted);

CREATE INDEX IX_event_attendees_user_id_active ON EventAttendees(user_id) WHERE is_deleted = 0;
CREATE INDEX IX_event_attendees_is_deleted ON EventAttendees(is_deleted);

CREATE INDEX IX_event_reminders_user_sent_active ON EventReminders(user_id, is_sent) WHERE is_deleted = 0;
CREATE INDEX IX_event_reminders_is_deleted ON EventReminders(is_deleted);

CREATE INDEX IX_event_files_event_id_active ON EventFiles(event_id) WHERE is_deleted = 0;
CREATE INDEX IX_event_files_uploaded_by_active ON EventFiles(uploaded_by) WHERE is_deleted = 0;
CREATE INDEX IX_event_files_is_deleted ON EventFiles(is_deleted);
