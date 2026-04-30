# Feature Specification: Local Image Metadata Manager

**Feature Branch**: `002-application-uses-vite`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Register Local Image Metadata (Priority: P1)

As a user, I want to register metadata for image files that already exist on my machine, so I can search and organize them without uploading files anywhere.

**Why this priority**: Metadata registration is the core value; without it the application does not fulfill its primary purpose.

**Independent Test**: Can be fully tested by opening the app, submitting metadata with a local file path, and confirming it persists and appears in the list after reload.

**Acceptance Scenarios**:

1. **Given** no metadata exists, **When** the user submits a valid local image path with title and tags, **Then** a new metadata entry is stored in SQLite and rendered in the UI list.
2. **Given** an existing metadata entry, **When** the user refreshes the page, **Then** the entry is loaded from SQLite and displayed with the same values.

---

### User Story 2 - Search and Filter Metadata (Priority: P2)

As a user, I want to search my saved metadata by title, tag, or file path, so I can quickly find specific images in a local collection.

**Why this priority**: Discovery and retrieval are the main follow-up value once metadata exists.

**Independent Test**: Can be tested by creating multiple entries, searching with different queries, and verifying only matching entries are shown.

**Acceptance Scenarios**:

1. **Given** multiple entries exist, **When** the user enters a search term, **Then** only entries matching title, tags, or path are shown.
2. **Given** filtered results are shown, **When** the user clears the search, **Then** all entries are visible again.

---

### User Story 3 - Edit and Delete Metadata (Priority: P3)

As a user, I want to update or delete stored metadata entries, so my catalog remains accurate as local files and classifications change.

**Why this priority**: Ongoing maintenance is important for long-term usability but depends on having data first.

**Independent Test**: Can be tested by editing one saved entry and deleting another, then reloading and confirming persistent changes.

**Acceptance Scenarios**:

1. **Given** a saved entry, **When** the user updates title or tags and saves, **Then** the updated metadata is persisted and reflected in the list.
2. **Given** a saved entry, **When** the user confirms delete, **Then** the entry is removed from SQLite and no longer appears in the UI.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when a submitted file path does not exist or is not readable?
- How does the system handle duplicate file paths for the same image?
- What happens when tags exceed allowed length or include invalid separators?
- How does the app behave when SQLite is unavailable or the DB file is locked?
- What happens if an entry references a file that was deleted outside the app?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST provide a UI built with Vite and primarily vanilla HTML, CSS, and JavaScript.
- **FR-002**: System MUST allow users to create metadata records for local image files without uploading image binaries to any remote service.
- **FR-003**: System MUST persist metadata records in a local SQLite database file.
- **FR-004**: System MUST support reading, updating, and deleting metadata records.
- **FR-005**: System MUST provide search/filter capability across title, file path, description, and tags.
- **FR-006**: System MUST validate required fields before persistence (minimum: file path and title).
- **FR-007**: System MUST prevent duplicate records by normalized file path.
- **FR-008**: System MUST return user-friendly validation and persistence errors in the UI.
- **FR-009**: System MUST store modification timestamps for each metadata record.
- **FR-010**: System MUST remain operable offline on a local machine.

### Key Entities *(include if feature involves data)*

- **ImageMetadata**: Represents a catalog entry for a local image. Key attributes include `id`, `file_path`, `title`, `description`, `tags`, `created_at`, and `updated_at`.
- **Tag**: Represents a searchable label assigned to an `ImageMetadata` item. Stored as normalized text linked to metadata entries.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 95% of valid metadata submissions complete successfully in under 1 second on a typical developer laptop.
- **SC-002**: Users can register, find, and edit an image metadata entry in under 60 seconds in usability tests.
- **SC-003**: Search results update in under 200 ms for datasets up to 10,000 metadata records.
- **SC-004**: 100% of persisted records survive application restart and remain queryable.

## Assumptions

- Primary users are local desktop users (single user profile per app instance).
- Initial release targets local development/runtime and does not include cloud sync.
- Image files already exist locally and are referenced by path only.
- Thumbnail generation is out of scope for v1 unless implementable without additional heavy libraries.
- A lightweight local API layer is acceptable to bridge browser UI and SQLite.
