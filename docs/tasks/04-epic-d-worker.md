# Epic D — Worker & External API Integration

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Async job processing with normalization and retries.

## Tasks

D1. **Worker Skeleton**

* BullMQ consumer; load request by `requestId`; update status lifecycle (`queued`→`processing`→`completed`/`failed`).

D2. **External API Integration (SerpAPI first)**

* Fetch raw results; secrets via Doppler; transient error retries/backoff.

D3. **Normalization Layer**

* Extract 5–7 fields (`title`, `price`, `currency`, `availability`, `supplier`, `imageUrl?`, `description?`).
* Persist normalized output on request doc.

D4. **Error Handling & Auditing**

* Store `error{message,code,timestamp}`; keep raw payload for debug.

**Done when:** Typical queries produce normalized results and survive transient failures via retries.

---

**Navigation:** [← Epic C - Research Core](./03-epic-c-research-core.md) | [Epic E - Webhooks →](./05-epic-e-webhooks.md)