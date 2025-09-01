# Requisio.com: Strategic Overview & Detailed MVP Plan

---

## 1. Overarching Business Vision & CEO Directives

**Vision Statement:** To empower businesses (initially focusing on commercial buildings, hotels, schools, or hospitals with dedicated product researchers) to conduct comprehensive product research effortlessly, transforming raw data into actionable market intelligence through a seamless, automated platform.

**Mission:** Provide a robust, scalable, and user-friendly Product Research Aggregator that simplifies data extraction, offers powerful normalization, and delivers timely insights, enabling our customers to make data-driven decisions.

**Initial Target Market (MVP & Phase 1):** Organizations like commercial buildings, hotels, schools, or hospitals that have personnel responsible for product research.

**Broader Workflow Context (Future Goal):** Support a multi-step procurement workflow involving: Requestor, Researcher (MVP FOCUS), Approver, Payer.

**Key Success Metrics to Track:** LTV, CAC/LTV, Burn Multiple, Churn, CAC, CES, ARR, NPS, Months to Recover CAC.

**Strategic Pillars:** Growth & Market Penetration, Innovation & Differentiation, Operational Excellence.

---

## 2. MVP Goal

> **Tech Stack**: See [Tech Stack Versions](/docs/tech-stack-versions.md) for detailed version specifications.

To deliver a stable, secure, and user-friendly core platform enabling the **"Researcher"** persona within the target organizations to:

* Register and log in securely.
* Submit product research requests.
* View the status of their research tasks (queued, started, failed, completed).
* Receive and view basic normalized product information (5-7 key fields) from a single integrated external API (e.g., SerpAPI).
* Configure a webhook URL to receive notifications for completed research.

The MVP will establish the foundational architecture designed for future scalability to support the broader workflow.

---

## 3. MVP Epics, Stories, and Detailed Sub-tasks

### Epic 1: Requisio.com: Core Platform Setup & Deployment (MVP)

**Summary:** Requisio.com: Core Platform Setup & Deployment (MVP) Epic
**Description:** Establish the foundational project structure, development environment, CI/CD pipeline for MVP, and necessary configurations for all services (frontend, backend, worker, databases) using Docker, Doppler, and basic CI. This setup will ensure readiness for current MVP needs and future expansion.

#### Story 1.1: Setup Monorepo Structure & Base Tooling
* **Summary:** Implement Setup: Monorepo Structure & Base Tooling
* **Description:**
    * **What:** Initialize the monorepo (e.g., using pnpm workspaces), set up TypeScript, ESLint, Prettier, and Husky for consistent code quality.
    * **Why:** To provide a clean, organized, and maintainable codebase from the start, facilitating collaboration and future scalability towards the full multi-role workflow.
* **Acceptance Criteria:**
    * Given a developer clones the repository,
    * When they run package installation,
    * Then all dependencies are installed correctly.
    * And ESLint, Prettier, TypeScript configurations are operational.
    * And pre-commit hooks enforce linting and formatting.
* **Estimate:** 3 SP
* **Priority:** High
* **Labels:** infra, tooling
* **Components:** Docker, Node.js, React.js, TypeScript
* **Sub-tasks:**
    * **Sub-task 1.1.1:** Initialize PNPM Workspace for Monorepo
    * **Sub-task 1.1.2:** Configure Root TypeScript (tsconfig.base.json)
    * **Sub-task 1.1.3:** Setup ESLint and Prettier with Shared Configurations
    * **Sub-task 1.1.4:** Implement Husky and lint-staged for Pre-commit Hooks

#### Story 1.2: Dockerize Services for Development
* **Summary:** Implement Docker: Dockerize Services for Development Environment
* **Description:**
    * **What:** Create Dockerfiles for frontend, backend, and worker services. Create a `docker-compose.yml` to orchestrate these services along with mongodb and redis (for BullMQ).
    * **Why:** To ensure a consistent and reproducible development environment for all team members, critical for efficient MVP development and later production deployment.
* **Acceptance Criteria:**
    * Given a developer has Docker and Docker Compose installed,
    * When they run `npm run dev` (or equivalent `docker compose up --build`),
    * Then all services (frontend, backend, worker, mongodb, redis) start successfully.
    * And frontend and backend services have live-reload enabled.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** infra, docker
* **Components:** Docker, Node.js, React.js, MongoDB, BullMQ
* **Sub-tasks:**
    * **Sub-task 1.2.1:** Create Dockerfile for Backend Service
    * **Sub-task 1.2.2:** Create Dockerfile for Frontend Service
    * **Sub-task 1.2.3:** Create Dockerfile for Worker Service
    * **Sub-task 1.2.4:** Develop `docker-compose.yml` for Local Orchestration
    * **Sub-task 1.2.5:** Configure Live-Reload for Development Services

#### Story 1.3: Implement Doppler for Secrets Management (MVP)
* **Summary:** Implement Config: Doppler for Secrets Management (MVP)
* **Description:**
    * **What:** Integrate Doppler into backend and worker services to manage API keys, database credentials, and Keycloak client secrets.
    * **Why:** To securely manage secrets and avoid committing them to the repository, essential for protecting our platform.
* **Acceptance Criteria:**
    * Given the services are running in Docker,
    * When the backend or worker starts,
    * Then they fetch their required secrets from Doppler.
    * And a `.env.sample` file is provided for local development guidance.
* **Estimate:** 3 SP
* **Priority:** High
* **Labels:** infra, config, security
* **Components:** Node.js, Docker, Doppler
* **Sub-tasks:**
    * **Sub-task 1.3.1:** Setup Doppler Project and Environments
    * **Sub-task 1.3.2:** Integrate Doppler CLI into Docker Startup (Backend & Worker)
    * **Sub-task 1.3.3:** Create `.env.sample` Files for Guidance

#### Story 1.4: Basic CI/CD Pipeline (MVP)
* **Summary:** Implement CI/CD: Basic Pipeline for MVP (Lint, Test, Build)
* **Description:**
    * **What:** Set up a basic CI/CD pipeline that triggers on pushes/PRs. The pipeline should lint, run unit tests, and build Docker images.
    * **Why:** To automate quality checks and prepare for deployments, ensuring stability for our initial users.
* **Acceptance Criteria:**
    * Given code is pushed to a PR targeting main,
    * When the CI pipeline runs,
    * Then it executes linting checks and unit tests for all services.
    * And it builds Docker images for frontend, backend, and worker.
    * And the pipeline reports success or failure.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** infra, ci-cd
* **Components:** Docker
* **Sub-tasks:**
    * **Sub-task 1.4.1:** Select CI/CD Platform and Configure Repository Integration
    * **Sub-task 1.4.2:** Create CI Pipeline Script: Linting Stage
    * **Sub-task 1.4.3:** Create CI Pipeline Script: Unit Testing Stage
    * **Sub-task 1.4.4:** Create CI Pipeline Script: Docker Image Building Stage

### Epic 2: Requisio.com: User Authentication & Authorization (MVP)

**Summary:** Requisio.com: User Authentication & Authorization (MVP) Epic
**Description:** Implement user registration and login via Keycloak. Establish basic role-based access control (RBAC) using CASL.js for MVP functionalities.

#### Story 2.1: Integrate Keycloak for User Authentication (Backend)
* **Summary:** Implement Auth: Keycloak Integration for Backend User Authentication
* **Description:**
    * **What:** Configure the backend to use Keycloak for JWT validation. Sync user info to a local MongoDB User collection.
    * **Why:** To provide secure user authentication and lay the groundwork for a flexible role system.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** backend, auth, security
* **Components:** Node.js, Keycloak, MongoDB

#### Story 2.2: Implement Basic CASL.js Authorization (Backend)
* **Summary:** Implement Auth: Basic CASL.js Setup for Backend Authorization
* **Description:**
    * **What:** Set up CASL.js in the backend to define and enforce permissions based on user roles.
    * **Why:** To control access to resources and actions, ensuring the authorization logic is flexible for future requirements.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** backend, auth, security
* **Components:** Node.js, CASL.js, Keycloak

#### Story 2.3: Implement Frontend Authentication Flow with Keycloak
* **Summary:** Implement Auth: Frontend Authentication Flow using `keycloak-js`
* **Description:**
    * **What:** Integrate the `keycloak-js` adapter into the React frontend to handle user login, logout, and token management.
    * **Why:** To enable users in target organizations to securely access the research platform.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** frontend, auth, security
* **Components:** React.js, Keycloak

#### Story 2.4: Implement Frontend UI for Basic CASL.js Authorization
* **Summary:** Implement Auth: Frontend UI Elements Controlled by CASL.js
* **Description:**
    * **What:** Use `@casl/react` to conditionally render UI elements based on the authenticated user's abilities.
    * **Why:** To ensure the UI accurately reflects what actions the user is permitted to perform.
* **Estimate:** 3 SP
* **Priority:** High
* **Labels:** frontend, auth, security
* **Components:** React.js, CASL.js

### Epic 3: Requisio.com: Research Management Core (MVP)

**Summary:** Requisio.com: Research Management Core (MVP) Epic
**Description:** Enable users (Researchers) to submit research requests, view their status, and see normalized results.

#### Story 3.1: Implement Backend API for Research Task Submission
* **Summary:** Implement API: Submit New Product Research Task
* **Description:**
    * **What:** Create a `POST /api/research` endpoint that creates a `ResearchRequest` document and adds a job to BullMQ.
    * **Why:** To allow users to initiate product research, the core function for the 'Researcher' persona.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** backend, api, feature
* **Components:** Node.js, MongoDB, BullMQ, CASL.js

#### Story 3.2: Implement Backend API to List and View Research Tasks
* **Summary:** Implement API: List and View User's Research Tasks
* **Description:**
    * **What:** Create `GET /api/research` and `GET /api/research/:id` endpoints. Results are filtered by CASL.js rules.
    * **Why:** To allow Researchers to track their work and view results.
* **Estimate:** 4 SP
* **Priority:** High
* **Labels:** backend, api, feature
* **Components:** Node.js, MongoDB, CASL.js

#### Story 3.3: Implement Frontend UI for Research Submission and Viewing
* **Summary:** Implement UI: Research Submission Form, Task List, and Result View
* **Description:**
    * **What:** Develop React components for a submission form, a task list/dashboard, and a view to show normalized data.
    * **Why:** To provide the user interface for core research functionalities for the Researcher.
* **Estimate:** 8 SP
* **Priority:** High
* **Labels:** frontend, feature, ui-ux
* **Components:** React.js, Redux Toolkit, Material UI

### Epic 4: Requisio.com: Worker & External API Integration (MVP)

**Summary:** Requisio.com: Worker & External API Integration (MVP) Epic
**Description:** Develop the BullMQ worker to process research jobs by fetching data from one external API, performing basic normalization, and updating the status.

#### Story 4.1: Develop BullMQ Worker for Research Processing
* **Summary:** Implement Worker: Process Research Jobs with BullMQ
* **Description:**
    * **What:** Create a BullMQ worker that listens to the 'research-jobs' queue, retrieves the task from MongoDB, and updates its status.
    * **Why:** To asynchronously process research requests without blocking the main application.
* **Estimate:** 4 SP
* **Priority:** High
* **Labels:** worker, backend
* **Components:** Node.js, BullMQ, MongoDB

#### Story 4.2: Integrate Single External API (e.g., SerpAPI) in Worker
* **Summary:** Implement Worker: Integrate with SerpAPI for Data Fetching
* **Description:**
    * **What:** The worker will make a call to an external API (e.g., SerpAPI) using the query from the research request.
    * **Why:** To gather raw product data based on the user's query.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** worker, backend, integration
* **Components:** Node.js, BullMQ, Doppler

#### Story 4.3: Implement Basic Data Normalization in Worker
* **Summary:** Implement Worker: Basic Data Normalization of API Response
* **Description:**
    * **What:** The worker will perform basic normalization to extract 5-7 predefined fields from the raw API response.
    * **Why:** To provide users with structured and easily consumable research results.
* **Estimate:** 5 SP
* **Priority:** High
* **Labels:** worker, backend, feature
* **Components:** Node.js, BullMQ, MongoDB

### Epic 5: Requisio.com: Webhook Notification System (MVP)

**Summary:** Requisio.com: Webhook Notification System (MVP) Epic
**Description:** Allow users to configure a webhook URL and send a notification with normalized data upon research completion.

#### Story 5.1: Implement User Ability to Configure Webhook URL
* **Summary:** Implement Feature: User Configuration for Webhook URL
* **Description:**
    * **What:** Create a backend endpoint and frontend UI for users to save/update their webhook URL.
    * **Why:** To allow users to receive research results programmatically in their own systems.
* **Estimate:** 4 SP
* **Priority:** High
* **Labels:** backend, frontend, feature
* **Components:** Node.js, React.js, MongoDB, CASL.js

#### Story 5.2: Implement Webhook Trigger in Worker on Research Completion
* **Summary:** Implement Worker: Trigger Webhook with Normalized Data
* **Description:**
    * **What:** When a research job is completed, the worker will send an HTTP POST request to the user's configured webhook URL.
    * **Why:** To notify external systems about completed research in real-time.
* **Estimate:** 4 SP
* **Priority:** High
* **Labels:** worker, backend, feature, integration
* **Components:** Node.js, BullMQ

---

## 4. Post-MVP Considerations & Future Epics (Revised)

This MVP focuses on the **"Researcher"** persona and core functionality. Future iterations will expand to support the full **"Requestor -> Researcher -> Approver -> Payer"** workflow and leverage insights from market analysis and CEO metrics.

* **Requisio.com: Multi-Role Workflow & Permissions:** Implement distinct user roles (Requestor, Approver, Payer) and features for task handoffs between them.
* **Requisio.com: Advanced Data Normalization & LLM Integration:** Allow custom normalization rules and explore LLMs for semantic extraction and advanced attribute inference.
* **Requisio.com: Multi-API Integration & Management:** Expand support for more external product data APIs and create a UI to manage integrations.
* **Requisio.com: Financials & Subscription Management:** Integrate a billing and subscription management system to track key financial metrics.
* **Requisio.com: Enhanced Admin & System Monitoring Dashboards:** Develop comprehensive dashboards for user management, system health, and job queue inspection.
* **Requisio.com: Platform-on-Platform Capabilities (API-first):** Expose a robust, well-documented public API for the Requisio.com platform itself.
* **Requisio.com: User Feedback & Support Systems:** Implement in-app feedback mechanisms and support channels to track NPS and CES.
* **Requisio.com: Advanced Analytics & Reporting for Users:** Allow users to perform analytics on their data and export it in various formats.

---

## 5. Monetization Strategy & Additional Revenue Streams

Beyond the foundational SaaS subscription model implied by tracking metrics like ARR, the Requisio.com platform can be monetized through several additional, value-added revenue streams:

1.  **Premium API Access & Higher Tiers**
    * **Concept:** Offer more advanced API access beyond what might be included in standard subscriptions. This could include higher rate limits, access to more granular data points, real-time data streams, or developer sandboxes for custom integrations.
    * **Value:** Caters to larger enterprises or tech companies looking to deeply embed Requisio.com data and functionality into their own internal systems or client-facing applications.

2.  **Advanced Analytics & Business Intelligence (BI) Suite**
    * **Concept:** A separately priced premium module offering sophisticated analytics tools beyond basic reporting. This could include customizable BI dashboards, predictive analytics on product availability or pricing, competitive landscape analysis based on aggregated research, and "what-if" scenario modeling for procurement decisions.
    * **Value:** Provides deeper, strategic market intelligence and foresight, transforming raw research data into high-value business insights.

3.  **Anonymized & Aggregated Market Insights Reports**
    * **Concept:** Package and sell anonymized, aggregated data insights derived from the platform's overall usage. This could include industry-specific trend reports, pricing benchmarks, supplier reliability indexes, or emerging product alerts.
    * **Value:** Offers valuable market intelligence to a broader audience, including those who may not be direct platform users but are interested in market trends (e.g., investors, market research firms).

4.  **Consulting & Managed Research Services**
    * **Concept:** Offer expert services where your team uses the Requisio.com platform to conduct bespoke research projects for clients, or provide consulting on how to optimize their procurement research workflows and integrate Requisio.com effectively.
    * **Value:** Caters to companies that lack the internal resources or expertise for complex research tasks or want a turnkey solution.

5.  **White-Label/OEM Licensing**
    * **Concept:** Allow other businesses (e.g., procurement consultancies, industry-specific software providers, large buying groups) to license the Requisio.com platform and offer it under their own brand.
    * **Value:** Opens new distribution channels and allows partners to offer a proven research solution to their existing client base without developing it themselves.

6.  **Curated Supplier/Vendor Marketplace & Premium Listings**
    * **Concept:** Develop a marketplace within Requisio.com where vetted suppliers or vendors can list their products and services. Revenue could be generated from premium listing fees, lead generation fees for suppliers, or transaction-based commissions (if ethically managed to maintain research objectivity).
    * **Value:** Provides a direct channel for suppliers to reach active product researchers and for researchers to potentially discover and connect with reliable vendors. This requires careful management to ensure research integrity.

7.  **Premium Data Source Integrations & Connectors**
    * **Concept:** While the core platform might support a few standard external APIs, charge additional fees for access to a broader library of premium, niche, or specialized industry-specific data sources. Also, charge for developing and maintaining bespoke connectors to clients' internal enterprise systems (ERP, P2P, etc.).
    * **Value:** Extends the research capabilities of the platform significantly by tapping into highly specific or valuable datasets tailored to different industries or research needs.

8.  **Professional Training & Certification Programs**
    * **Concept:** Develop and sell training courses, workshops, and certification programs focused on mastering the Requisio.com platform, advanced product research methodologies, and data interpretation for procurement intelligence.
    * **Value:** Enhances user proficiency, increases platform adoption and stickiness, and establishes Requisio.com as a thought leader in product research.

9.  **Enterprise Feature Sponsorship & Custom Development**
    * **Concept:** For large enterprise clients with unique needs, offer the option to sponsor or co-fund the development of specific advanced features, custom modules, or integrations that are not on the standard roadmap. They might get early access or some exclusivity for a period.
    * **Value:** Allows enterprises to get tailored solutions while helping fund platform development that could eventually benefit other users.

10. **Usage-Based Credits for Resource-Intensive Tasks**
    * **Concept:** For operations that go significantly beyond typical subscription usage and consume substantial computing resources (e.g., very large-scale batch research runs, complex data normalization using advanced AI/LLM models, extensive historical data analysis), implement a pay-per-use credit system.
    * **Value:** Provides flexibility for users with occasional high-demand needs without forcing them into a much higher, fixed subscription tier, while ensuring Requisio.com covers the costs of these intensive operations.