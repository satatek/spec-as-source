# Quickstart: Local Image Metadata Manager

## Prerequisites
- Node.js 22+ (tested with Node 24 LTS)
- npm 10+
- `python3`, `make`, and a C++ compiler (for `better-sqlite3` native build)

## Setup
1. Install dependencies for frontend and backend.
2. Initialize SQLite schema in `data/image-metadata.db`.
3. Start backend API and Vite frontend.

## Suggested Commands
```bash
# (if using nvm, activate node first)
# export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

# install
npm install

# initialize database schema
npm run db:init

# run backend + frontend in development
npm run dev
```

## Manual Verification Flow
1. Open the app in the browser.
2. Add a metadata entry with a local image path, title, optional description, and tags.
3. Refresh the page and confirm data persisted.
4. Search by title and tag and confirm filtering behavior.
5. Edit a record and verify `updatedAt` changed.
6. Delete a record and confirm it no longer appears.

## Test Execution
```bash
# unit tests
npm run test:unit

# integration tests (API + SQLite)
npm run test:integration

# end-to-end UI tests
npm run test:e2e
```

## Performance Checks
- Validate create/update/read operations complete under 1s for normal records.
- Seed 10k records and verify search response remains under 200ms.

## Notes
- No image binaries are uploaded or transferred; only local file paths and metadata are stored.
- App is expected to run fully offline on a local machine.
