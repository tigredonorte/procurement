# Epic E — Webhook Notifications

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Notify external systems when research completes.

## Tasks

E1. **Webhook Config**

* `WebhookConfig` model + CRUD (`/api/v1/webhooks`).
* HMAC secret optional; enable/disable per event type.

E2. **Worker Trigger**

* On `completed`/`failed`, POST `WebhookPayload` to configured URL with signature header; backoff retries.

E3. **Frontend Settings UI**

* Page to add/edit webhook URL, secret, events.

**Done when:** External listener can receive signed payloads reliably; UI validates URLs and shows delivery logs/outcomes.

---

**Navigation:** [← Epic D - Worker](./04-epic-d-worker.md) | [Epic F - UI/UX →](./06-epic-f-ui-ux.md)