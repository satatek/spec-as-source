# Data Model: Local Image Metadata Manager

## Entity: image_metadata
- Description: Metadata entry for a local image file.
- Fields:
  - `id` (INTEGER, PK, auto-increment)
  - `file_path` (TEXT, required, unique, normalized)
  - `title` (TEXT, required, 1..200 chars)
  - `description` (TEXT, optional, max 2000 chars)
  - `created_at` (TEXT ISO-8601, required)
  - `updated_at` (TEXT ISO-8601, required)
- Validation rules:
  - `file_path` must be non-empty and normalized before uniqueness checks.
  - `title` must be non-empty after trimming.
  - `updated_at` must be refreshed on every update.
- State transitions:
  - `created` -> `updated` (on edit)
  - `created|updated` -> `deleted` (hard delete for v1)

## Entity: tags
- Description: Unique label catalog for metadata classification.
- Fields:
  - `id` (INTEGER, PK, auto-increment)
  - `name` (TEXT, required, unique, lowercase-normalized)
- Validation rules:
  - `name` must be non-empty and unique case-insensitively.
  - `name` max length 50.

## Entity: image_metadata_tags
- Description: Many-to-many relation between metadata entries and tags.
- Fields:
  - `image_metadata_id` (INTEGER, FK -> image_metadata.id, required)
  - `tag_id` (INTEGER, FK -> tags.id, required)
- Constraints:
  - Composite uniqueness on (`image_metadata_id`, `tag_id`).
  - Cascading delete from `image_metadata` to relation rows.

## Query model notes
- Search scope includes `title`, `description`, `file_path`, and tag names.
- Default listing order: `updated_at DESC`.
- Pagination target for v1: offset/limit optional; not required for first release unless data volume requires it.
