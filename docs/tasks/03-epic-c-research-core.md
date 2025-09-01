# Epic C — Research Management Core (API + UI)

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Submit research, list/status, read results.

## Tasks

C1. **Model & Validation**

* `ResearchRequest` schema: query, parameters, status, results, jobId, timestamps.
* Zod validation on inputs.

C2. **API Endpoints**

* `POST /api/v1/research` (create + enqueue)
* `GET /api/v1/research` (paginated list, scoped)
* `GET /api/v1/research/:id` (details)
* `GET /api/v1/research/:id/status` (progress)

C3. **Frontend Screens**

* Submission form (query + params).
* Research list/dashboard with status chips.
* Details view for normalized results (table/cards).

**Done when:** A user can create, view, and read a completed item (assuming worker completes jobs).

---

**Navigation:** [← Epic B - Auth](./02-epic-b-auth.md) | [Epic D - Worker →](./04-epic-d-worker.md)