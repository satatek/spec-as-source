# Research: Local Image Metadata Manager

## Decision 1: Use a minimal local API layer between browser UI and SQLite
- Decision: Implement a small Node.js HTTP API for metadata operations instead of direct browser-to-SQLite access.
- Rationale: Browsers cannot safely access SQLite files directly; a local API preserves security and supports validation and transactional persistence.
- Alternatives considered: SQL.js in browser (larger payload and memory overhead), Electron-native direct DB access (higher complexity), remote backend (violates local/offline preference).

## Decision 2: Keep frontend implementation vanilla under Vite
- Decision: Build UI with plain HTML, CSS, and JavaScript modules, using Vite only for dev server and bundling.
- Rationale: Matches the requirement to minimize libraries and keep implementation transparent.
- Alternatives considered: React/Vue/Svelte (faster component patterns but adds dependency and abstraction overhead not required for v1).

## Decision 3: Use better-sqlite3 for synchronous local persistence
- Decision: Use better-sqlite3 for SQLite operations in local backend.
- Rationale: Minimal API, low overhead, reliable local performance, and straightforward schema/migration setup.
- Alternatives considered: sqlite3 callback API (more boilerplate), Prisma/ORM layers (extra dependencies and generated artifacts beyond current scope).

## Decision 4: Represent tags in a normalized junction table
- Decision: Store tags in a dedicated `tags` table with `image_metadata_tags` junction rows.
- Rationale: Supports efficient search/filtering, deduplication, and future analytics.
- Alternatives considered: Comma-separated string in one column (simpler write path but poor queryability and normalization).

## Decision 5: Testing strategy aligned to constitution requirements
- Decision: Define test layers as unit (validation/utilities), integration (API + SQLite), and end-to-end (UI flows in browser).
- Rationale: Satisfies constitution requirement for comprehensive testing and verifies behavior from multiple risk levels.
- Alternatives considered: Unit-only testing (insufficient confidence for API and UI workflows), manual-only QA (not automatable).
