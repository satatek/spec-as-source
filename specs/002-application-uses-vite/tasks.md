# Tasks: Local Image Metadata Manager

**Input**: Design documents from `/specs/002-application-uses-vite/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included because this feature explicitly defines a comprehensive testing strategy (unit, integration, end-to-end) in design artifacts.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All task descriptions include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [ ] T001 Initialize Node workspace and scripts in package.json
- [ ] T002 Create backend and frontend base folders in backend/src/.gitkeep and frontend/src/.gitkeep
- [ ] T003 [P] Configure Vite for vanilla frontend in frontend/vite.config.js
- [ ] T004 [P] Configure root scripts for dev and test orchestration in package.json
- [ ] T005 [P] Add baseline npm ignore and editor settings in .gitignore and .editorconfig

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Define SQLite schema and initialization SQL in backend/src/db/schema.sql
- [ ] T007 Implement database bootstrap and connection helper in backend/src/db/database.js
- [ ] T008 [P] Implement shared metadata validation utilities in backend/src/validation/metadata-validation.js
- [ ] T009 [P] Implement shared API error envelope helper in backend/src/api/error-response.js
- [ ] T010 Implement backend HTTP server entry and route mounting in backend/src/server.js
- [ ] T011 [P] Implement frontend API client wrapper in frontend/src/services/api-client.js
- [ ] T012 [P] Create base HTML shell and app mount in frontend/index.html
- [ ] T013 [P] Create base frontend styling tokens and layout in frontend/src/styles.css
- [ ] T014 Configure Vitest unit/integration setup in backend/tests/vitest.config.js
- [ ] T015 Configure Playwright e2e setup in frontend/tests/playwright.config.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Register Local Image Metadata (Priority: P1) 🎯 MVP

**Goal**: Let users register local image metadata and persist/reload records from SQLite.

**Independent Test**: Submit a valid local image metadata form, refresh, and verify the saved record remains listed.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add contract tests for create/list endpoints in backend/tests/integration/metadata-create-list.contract.test.js
- [ ] T017 [P] [US1] Add unit tests for metadata input validation in backend/tests/unit/metadata-validation.test.js
- [ ] T018 [P] [US1] Add end-to-end test for add-and-refresh workflow in frontend/tests/e2e/metadata-create-refresh.spec.js

### Implementation for User Story 1

- [ ] T019 [P] [US1] Implement metadata repository create/list operations in backend/src/models/metadata-repository.js
- [ ] T020 [P] [US1] Implement tag repository upsert/link helpers in backend/src/models/tag-repository.js
- [ ] T021 [US1] Implement metadata service create/list workflow in backend/src/services/metadata-service.js
- [ ] T022 [US1] Implement POST and GET metadata routes in backend/src/api/metadata-routes.js
- [ ] T023 [P] [US1] Implement metadata form component in frontend/src/components/metadata-form.js
- [ ] T024 [P] [US1] Implement metadata list component in frontend/src/components/metadata-list.js
- [ ] T025 [US1] Implement page bootstrap and submit/list wiring in frontend/src/pages/metadata-page.js
- [ ] T026 [US1] Wire frontend app entrypoint to metadata page in frontend/src/main.js

**Checkpoint**: User Story 1 is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 - Search and Filter Metadata (Priority: P2)

**Goal**: Let users search metadata by title, path, description, and tags.

**Independent Test**: Seed multiple records and verify query filtering and clear-search behavior independently.

### Tests for User Story 2

- [ ] T027 [P] [US2] Add contract tests for query filtering in backend/tests/integration/metadata-search.contract.test.js
- [ ] T028 [P] [US2] Add unit tests for search query normalization in backend/tests/unit/metadata-search-normalization.test.js
- [ ] T029 [P] [US2] Add end-to-end test for search and clear filters in frontend/tests/e2e/metadata-search.spec.js

### Implementation for User Story 2

- [ ] T030 [US2] Implement search query support in metadata repository list query in backend/src/models/metadata-repository.js
- [ ] T031 [US2] Implement search orchestration in metadata service in backend/src/services/metadata-service.js
- [ ] T032 [US2] Extend GET metadata route for q parameter in backend/src/api/metadata-routes.js
- [ ] T033 [P] [US2] Implement search input component in frontend/src/components/metadata-search.js
- [ ] T034 [US2] Integrate search component with page state and API calls in frontend/src/pages/metadata-page.js
- [ ] T035 [US2] Update metadata list empty/filter states in frontend/src/components/metadata-list.js

**Checkpoint**: User Stories 1 and 2 are both independently testable.

---

## Phase 5: User Story 3 - Edit and Delete Metadata (Priority: P3)

**Goal**: Let users edit existing metadata and delete records with confirmation.

**Independent Test**: Edit one record and delete another, reload, and verify persistence and removal.

### Tests for User Story 3

- [ ] T036 [P] [US3] Add contract tests for update/delete endpoints in backend/tests/integration/metadata-update-delete.contract.test.js
- [ ] T037 [P] [US3] Add unit tests for update payload validation in backend/tests/unit/metadata-update-validation.test.js
- [ ] T038 [P] [US3] Add end-to-end test for edit and delete flows in frontend/tests/e2e/metadata-edit-delete.spec.js

### Implementation for User Story 3

- [ ] T039 [US3] Implement metadata repository get/update/delete operations in backend/src/models/metadata-repository.js
- [ ] T040 [US3] Implement update/delete service logic with updatedAt refresh in backend/src/services/metadata-service.js
- [ ] T041 [US3] Implement GET by id, PUT, and DELETE metadata routes in backend/src/api/metadata-routes.js
- [ ] T042 [P] [US3] Implement metadata row actions (edit/delete) in frontend/src/components/metadata-list-item-actions.js
- [ ] T043 [US3] Integrate edit form state and delete confirmation flow in frontend/src/pages/metadata-page.js
- [ ] T044 [US3] Add update/delete methods to frontend API client in frontend/src/services/api-client.js

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements across stories and readiness checks

- [ ] T045 [P] Add accessibility labels and keyboard behavior improvements in frontend/src/pages/metadata-page.js
- [ ] T046 [P] Add performance index and query optimization notes in backend/src/db/schema.sql
- [ ] T047 Add quickstart command verification notes in specs/002-application-uses-vite/quickstart.md
- [ ] T048 Run full quality suite script and document outcome in README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, starts immediately.
- **Phase 2 (Foundational)**: Depends on Setup completion and blocks all user stories.
- **Phase 3 (US1)**: Depends on Foundational completion only.
- **Phase 4 (US2)**: Depends on Foundational completion; can run after US1 or in parallel if staffed.
- **Phase 5 (US3)**: Depends on Foundational completion; can run after US1 or in parallel if staffed.
- **Phase 6 (Polish)**: Depends on all target stories complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories (MVP slice).
- **US2 (P2)**: Uses the same metadata domain but remains independently testable with seeded data.
- **US3 (P3)**: Uses existing metadata records and remains independently testable.

### Within Each User Story

- Write tests first and confirm they fail before implementing behavior.
- Implement repository/model changes before service changes.
- Implement service changes before API routes.
- Implement API routes before frontend integration wiring.

---

## Parallel Opportunities

- Setup tasks marked [P]: T003, T004, T005.
- Foundational tasks marked [P]: T008, T009, T011, T012, T013.
- US1 test tasks marked [P]: T016, T017, T018.
- US1 component tasks marked [P]: T019, T020, T023, T024.
- US2 test tasks marked [P]: T027, T028, T029.
- US2 frontend component task marked [P]: T033.
- US3 test tasks marked [P]: T036, T037, T038.
- US3 frontend action component task marked [P]: T042.
- Polish tasks marked [P]: T045, T046.

---

## Parallel Example: User Story 1

```bash
# Run US1 tests in parallel:
Task T016: backend/tests/integration/metadata-create-list.contract.test.js
Task T017: backend/tests/unit/metadata-validation.test.js
Task T018: frontend/tests/e2e/metadata-create-refresh.spec.js

# Build US1 independent components in parallel:
Task T019: backend/src/models/metadata-repository.js
Task T020: backend/src/models/tag-repository.js
Task T023: frontend/src/components/metadata-form.js
Task T024: frontend/src/components/metadata-list.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests and implementation (T016-T026).
3. Validate the independent US1 test criteria.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver MVP with US1.
2. Add US2 and validate search independently.
3. Add US3 and validate edit/delete independently.
4. Apply polish and final quality sweep.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then split by story:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3
3. Merge after each story meets its independent test criteria.

---

## Notes

- Every task line follows the required checklist format: checkbox, task ID, optional [P], optional [USx], and file path.
- Task IDs are sequential and execution-oriented (T001-T048).
- User story tasks are labeled [US1], [US2], [US3] for traceability.
