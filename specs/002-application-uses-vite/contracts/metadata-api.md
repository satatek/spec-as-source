# Contract: Local Metadata API

## Overview
This contract defines the local HTTP API between the Vite frontend and the local Node.js backend that persists metadata in SQLite.

Base URL (dev): `http://localhost:5174`

Content type: `application/json`

## Data Shapes

### ImageMetadata
```json
{
  "id": 1,
  "filePath": "/home/user/Pictures/photo-01.jpg",
  "title": "Beach Sunset",
  "description": "Taken during summer trip.",
  "tags": ["travel", "sunset"],
  "createdAt": "2026-04-29T12:00:00Z",
  "updatedAt": "2026-04-29T12:00:00Z"
}
```

### ValidationError
```json
{
  "error": "validation_error",
  "message": "filePath is required",
  "field": "filePath"
}
```

## Endpoints

### POST /api/metadata
Create a metadata record.

Request body:
```json
{
  "filePath": "/home/user/Pictures/photo-01.jpg",
  "title": "Beach Sunset",
  "description": "Taken during summer trip.",
  "tags": ["travel", "sunset"]
}
```

Responses:
- `201 Created`: returns `ImageMetadata`
- `400 Bad Request`: validation error
- `409 Conflict`: duplicate normalized file path

### GET /api/metadata
List metadata records.

Query params:
- `q` (optional): search keyword across title, description, path, and tags

Responses:
- `200 OK`: array of `ImageMetadata`

### GET /api/metadata/:id
Get one metadata record by ID.

Responses:
- `200 OK`: `ImageMetadata`
- `404 Not Found`

### PUT /api/metadata/:id
Update metadata record.

Request body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["updated", "tag"]
}
```

Responses:
- `200 OK`: updated `ImageMetadata`
- `400 Bad Request`: validation error
- `404 Not Found`

### DELETE /api/metadata/:id
Delete metadata record.

Responses:
- `204 No Content`
- `404 Not Found`

## Behavioral Rules
- The backend MUST NOT accept binary image upload payloads.
- `filePath` uniqueness is enforced using normalized values.
- Tags are stored normalized (`trim`, lowercase, deduplicated per record).
- Every successful update refreshes `updatedAt`.
- Error responses use stable `error` codes for UI handling.

## Test Contract Coverage
- Contract tests validate status codes, shape constraints, and error semantics.
- Integration tests validate SQLite persistence across process restart.
- End-to-end tests validate add/search/edit/delete workflows through browser UI.
