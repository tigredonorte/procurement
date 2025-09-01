# Epic B — Authentication & Authorization

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Secure login, role-scoped access.

## Tasks

B1. **Backend Keycloak**

* JWT validation middleware; user sync to Mongo (`User` collection).

B2. **Backend CASL**

* Define abilities for `researcher` and `admin`; enforce in controllers.

B3. **Frontend Keycloak**

* `keycloak-js` adapter; login/logout/refresh; token injection on API.

B4. **Frontend CASL UI**

* Conditional rendering of protected actions/sections.

**Done when:** Auth flow works E2E; protected API returns 401/403 as expected; UI hides forbidden actions.

---

**Navigation:** [← Epic A - Foundations](./01-epic-a-foundations.md) | [Epic C - Research Core →](./03-epic-c-research-core.md)