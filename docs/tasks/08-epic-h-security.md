# Epic H — Security Hardening

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Minimum bar for MVP in production.

## Tasks

H1. **API Protections**

* Helmet headers; strict CORS; **rate-limit \~100 req/min per user**.
* Input validation with Zod everywhere.

H2. **Data Security**

* TLS enforced; at-rest encryption settings; secrets only via Doppler.

H3. **Abuse & Fault Controls**

* Worker job backoff caps; payload size limits; webhook domain allowlist (optional for MVP).

**Done when:** External scan shows no high-severity findings; fuzzing/basic abuse tests pass.

---

**Navigation:** [← Epic G - Observability](./07-epic-g-observability.md) | [Epic I - Documentation →](./09-epic-i-documentation.md)