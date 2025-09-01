# System Requirements - Requisio.com

## 1. Core Features and Domain

### 1.1 Reason for Existence
Requisio.com exists to automate and optimize the product research process for commercial organizations (hospitals, hotels, schools, commercial buildings). The system transforms manual product research into an automated process, aggregating data from multiple sources and normalizing information for data-driven decision making.

### 1.2 Application Domain

#### Business Context
- **Problem**: Product researchers spend hours manually searching across multiple websites
- **Solution**: Unified platform that automates research, normalizes data, and delivers insights
- **Target Users**: Researchers in B2B organizations (MVP focuses on "Researcher" role)

#### Core Features

1. **Product Research Management**
   - Submit research queries with customizable parameters
   - Asynchronous processing of research tasks
   - Real-time status visualization (queued, processing, completed, failed)
   - Research storage and history

2. **Multi-source Data Aggregation**
   - External API integration (SerpAPI initially)
   - Automated product data collection
   - Future support for multiple data sources

3. **Data Normalization**
   - Extract key fields (5-7 fields in MVP):
     - Product title
     - Product Url
     - Description
     - Availability
     - Supplier Name
     - Currency
     - Price
     - Image URL
     - Shipping
     - Estimated Delivery Date (ETA)
   - Standardize formats and units

4. **Results Delivery**
   - Web interface for visualization
   - RESTful API for integration
   - Webhook notifications

### 1.3 Support Features

#### Authentication and Authorization
- **Secure Login via Keycloak**
  - SSO (Single Sign-On) support
  - Centralized identity management
  - JWT tokens for sessions

- **Role-Based Access Control (RBAC)**
  - CASL.js implementation
  - Initial roles: Researcher, Admin
  - Granular permissions per resource

#### Configuration Management
- **Webhook Management**
  - Configure notification URLs
  - HMAC security support
  - Event selection for notifications

- **User Preferences**
  - Default search settings
  - Interface customization
  - History and favorites

#### Supporting Infrastructure
- **Queue System (BullMQ)**
  - Asynchronous processing
  - Automatic retry with backoff
  - Job prioritization

- **Logging and Monitoring**
  - Structured logs (Winston)
  - Request tracking
  - Performance metrics

- **Cache and Performance**
  - Redis for session cache
  - Frequent query optimization
  - Static asset CDN

## 2. Functional Requirements

### FR001 - Authentication
- System must allow new user registration
- System must authenticate users via email/password or SSO
- System must maintain secure sessions with refresh tokens

### FR002 - Research Management
- User must be able to create new research with query and parameters
- User must view list of their research tasks
- User must track status in real-time
- User must access normalized results

### FR003 - Data Processing
- System must process research asynchronously
- System must normalize data in standardized format
- System must store raw data for auditing

### FR004 - Notifications
- System must send webhook upon research completion
- System must allow event configuration
- System must ensure delivery with retry

## 3. Non-Functional Requirements

### 3.1 Performance
- **Latency**: Response time < 200ms (P95) for APIs
- **Throughput**: Support 100 requests/minute per user
- **Processing**: Jobs completed in < 30 seconds

### 3.2 Availability vs Consistency (CAP Trade-offs)

#### Architectural Choice: AP (Availability + Partition Tolerance)
- **High Availability**: System continues operating with partial failures
- **Eventual Consistency**: Data may have synchronization delay
- **Justification**: Research doesn't require immediate consistency

#### Implications:
- Cache with TTL to reduce load
- Asynchronous data replication
- Eventual consistency for research results

### 3.3 Scalability
- **Horizontal Scaling**: Stateless microservices
- **Auto-scaling**: Based on CPU/memory
- **Database Sharding**: Prepared for partitioning

### 3.4 Security
- **Authentication**: OAuth 2.0 / OpenID Connect
- **Authorization**: RBAC with CASL.js
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Compliance**: GDPR-ready, LGPD-ready

### 3.5 Reliability
- **Uptime Target**: 99.9% (allows ~8h downtime/year)
- **Backup**: Daily with 30-day retention
- **Disaster Recovery**: RTO < 4 hours, RPO < 1 hour

### 3.6 Maintainability
- **Documentation**: OpenAPI/Swagger for APIs
- **Monitoring**: Centralized logs, metrics, alerts
- **Deployment**: Zero-downtime with blue-green
- **Rollback**: Ability to revert in < 5 minutes

## 4. Constraints and Assumptions

### Technical Constraints
- Defined stack: React 19, Node.js 24, MongoDB 7
- Limited initial budget (MVP)
- Small team (2-3 developers)

### Business Assumptions
- Initial focus on medium B2B organizations
- Integration with 1 external API in MVP
- Gradual feature expansion post-MVP

### External Dependencies
- SerpAPI for product data
- Keycloak for authentication
- Doppler for secrets management
- Cloud provider (AWS/GCP/Azure) for production

---

## Next Documents
- [02 - Capacity Estimation](./02-capacity-estimation.md)
- [03 - Data Modeling](./03-data-modeling.md)
- [04 - API Design](./04-api-design.md)
- [05 - System Architecture](./05-system-architecture.md)
- [06 - Trade-offs and Decisions](./06-trade-offs.md)