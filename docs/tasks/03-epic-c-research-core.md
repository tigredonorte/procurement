# Epic C — Research Management Core System

[← Back to Tasks Overview](./readme.md)

---

## Goal Statement
Implement the core research management system that enables researchers to submit product research requests, track their progress in real-time, and access normalized results through both API endpoints and intuitive user interfaces, forming the foundation of the MVP functionality.

## Success Criteria
- Researchers can submit complex research requests with detailed parameters
- Real-time status tracking with progress indicators and estimated completion times
- Comprehensive result display with normalized product data across multiple formats
- Robust API endpoints supporting pagination, filtering, and sorting
- Excellent user experience with responsive design and accessibility compliance
- Performance targets: <200ms API response times, <2s page load times

## Technical Requirements

### Data Model Compliance
- MongoDB collections following documented schema specifications
- Full compliance with normalized product schema (7 core fields)
- Comprehensive audit logging for all research operations
- Support for complex search parameters and filters
- Efficient indexing strategy for optimal query performance

### API Design Standards
- RESTful endpoints following OpenAPI 3.0 specification
- Comprehensive input validation with Zod schemas
- Consistent error handling and response formats
- Rate limiting and security controls
- Pagination with cursor-based and offset strategies

## Tasks

### C1. Data Models & Comprehensive Validation Framework
**Priority**: Critical | **Effort**: L | **Dependencies**: B1, B2

**Scope:**
- Implement complete ResearchRequest MongoDB schema with all documented fields
- Create comprehensive Zod validation schemas for all inputs and outputs
- Set up efficient database indexing strategy
- Implement data relationship management and referential integrity
- Create validation middleware for API endpoints

**Technical Implementation:**

**ResearchRequest Schema (Complete Implementation):**
```typescript
interface ResearchRequest {
  _id: ObjectId;
  userId: ObjectId;  // reference to users collection
  query: {
    text: string;  // min 3 chars, max 500 chars
    categories: string[];  // optional, validated categories
    filters: {
      priceRange?: {
        min: number;
        max: number;
        currency: string;  // ISO 4217
      };
      availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'all';
      suppliers?: string[];
      location?: string;
      urgency?: 'low' | 'medium' | 'high';
    };
  };
  parameters: {
    sources: string[];  // ['serpapi'], extendable
    maxResults: number;  // 10-500, default 50
    searchDepth: 'shallow' | 'medium' | 'deep';
    includeImages: boolean;
    includeReviews: boolean;
  };
  status: {
    current: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;  // 0-100
    message: string;
    startedAt?: Date;
    completedAt?: Date;
    processingTime?: number;  // seconds
  };
  results: {
    summary: {
      totalFound: number;
      totalProcessed: number;
      totalNormalized: number;
      avgPrice?: number;
      priceRange?: { min: number; max: number };
      topSuppliers?: string[];
    };
    products: NormalizedProduct[];
  };
  rawData: Record<string, any>;  // Original API responses
  errors: ErrorLog[];
  jobInfo: {
    jobId: string;
    queue: string;
    priority: number;
    attempts: number;
    worker?: string;
  };
  notifications: {
    webhook?: WebhookDelivery;
    email?: EmailNotification;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;  // TTL for cleanup
    version: number;
  };
}
```

**Normalized Product Schema:**
```typescript
interface NormalizedProduct {
  id: string;  // unique identifier
  title: string;
  description?: string;
  priceUnit: number;
  currency: string;  // ISO 4217
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  supplier: {
    name: string;
    id: string;
    rating?: number;
  };
  images: string[];  // URLs
  specifications: Record<string, any>;
  url: string;  // source URL
  lastUpdated: Date;
}
```

**Comprehensive Zod Validation:**
```typescript
const ResearchRequestCreateSchema = z.object({
  query: z.object({
    text: z.string().min(3).max(500),
    categories: z.array(z.string()).optional(),
    filters: z.object({
      priceRange: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().length(3)
      }).optional(),
      availability: z.enum(['in_stock', 'out_of_stock', 'limited', 'all']).optional(),
      suppliers: z.array(z.string()).optional(),
      location: z.string().optional(),
      urgency: z.enum(['low', 'medium', 'high']).optional()
    }).optional()
  }),
  parameters: z.object({
    sources: z.array(z.string()).default(['serpapi']),
    maxResults: z.number().min(10).max(500).default(50),
    searchDepth: z.enum(['shallow', 'medium', 'deep']).default('medium'),
    includeImages: z.boolean().default(true),
    includeReviews: z.boolean().default(false)
  }).optional()
});
```

**Database Indexing Strategy:**
```javascript
// Compound indexes for optimal query performance
db.research_requests.createIndex({ "userId": 1, "metadata.createdAt": -1 });
db.research_requests.createIndex({ "status.current": 1 });
db.research_requests.createIndex({ "jobInfo.jobId": 1 }, { unique: true });
db.research_requests.createIndex({ "metadata.expiresAt": 1 }, { expireAfterSeconds: 0 });
db.research_requests.createIndex({ "query.text": "text" });  // Full-text search
db.research_requests.createIndex({ "query.categories": 1 });
```

**Acceptance Criteria:**
- [ ] All data models implemented with complete field validation
- [ ] Database indexes created for optimal query performance
- [ ] Zod schemas validate all input/output data correctly
- [ ] Referential integrity maintained between collections
- [ ] TTL configured for automatic data cleanup
- [ ] Full-text search capability implemented
- [ ] Data validation prevents invalid states
- [ ] Comprehensive error messages for validation failures

**Files Created:**
- `packages/backend/src/models/ResearchRequest.model.ts`
- `packages/backend/src/schemas/research.schemas.ts`
- `packages/backend/src/utils/validation.middleware.ts`
- `packages/shared/src/types/research.types.ts`
- `packages/backend/src/database/indexes.ts`

---

### C2. Comprehensive REST API Implementation
**Priority**: Critical | **Effort**: L | **Dependencies**: C1, B2

**Scope:**
- Implement all research management API endpoints with full CRUD operations
- Add comprehensive filtering, sorting, and pagination capabilities
- Implement real-time status updates and progress tracking
- Create export functionality for research results
- Set up rate limiting and security controls specific to research operations

**Technical Implementation:**

**Core API Endpoints:**

**1. Create Research Request**
```
POST /api/v1/research
Authentication: Required (Bearer token)
Permissions: research.create
Rate Limit: 100 requests/hour per user

Request Body: ResearchRequestCreateSchema
Response: 201 Created with research ID, status, estimated time
Response Headers: Location header with resource URL
```

**2. List Research Requests (Advanced)**
```
GET /api/v1/research
Authentication: Required
Permissions: research.read

Query Parameters:
- page: number (default: 1)
- limit: number (10-100, default: 20)
- status: enum filter
- sortBy: createdAt|completedAt|status|progress
- sortOrder: asc|desc
- search: full-text search
- fromDate: ISO 8601 date
- toDate: ISO 8601 date
- category: filter by categories
- urgent: boolean (high priority only)

Response: Paginated list with comprehensive metadata
```

**3. Get Research Details**
```
GET /api/v1/research/:id
Authentication: Required
Permissions: research.read + resource ownership

Response: Complete research object with results
ETag: For caching optimization
Last-Modified: For conditional requests
```

**4. Real-time Status Endpoint**
```
GET /api/v1/research/:id/status
Authentication: Required
Permissions: research.read + resource ownership

Response: Status object with progress, ETA, current step
Cache-Control: no-cache (always fresh data)
```

**5. Export Research Results**
```
GET /api/v1/research/:id/export
Authentication: Required
Permissions: research.read + resource ownership

Query Parameters:
- format: json|csv|xlsx
- fields: comma-separated list of fields

Response: File download with appropriate Content-Type
```

**6. Cancel Research Request**
```
DELETE /api/v1/research/:id
Authentication: Required
Permissions: research.delete + resource ownership

Response: 204 No Content (if cancellation successful)
Constraints: Only queued/processing requests can be cancelled
```

**Advanced Features:**

**Batch Operations:**
```
POST /api/v1/research/batch
PUT /api/v1/research/batch/cancel
```

**Search and Analytics:**
```
GET /api/v1/research/analytics/summary
GET /api/v1/research/search/suggestions
```

**Controller Implementation Pattern:**
```typescript
class ResearchController {
  constructor(
    private researchService: ResearchService,
    private queueService: QueueService,
    private validationService: ValidationService,
    private permissionService: PermissionService
  ) {}

  async create(req: AuthenticatedRequest, res: Response) {
    // 1. Validate input with Zod
    // 2. Check permissions
    // 3. Check rate limits
    // 4. Create research record
    // 5. Enqueue job
    // 6. Return response with location header
  }

  async list(req: AuthenticatedRequest, res: Response) {
    // 1. Parse and validate query parameters
    // 2. Apply permission filters
    // 3. Build database query with indexes
    // 4. Execute with pagination
    // 5. Return formatted response with metadata
  }
}
```

**Error Handling Specifications:**
- Comprehensive error codes for all failure scenarios
- Detailed validation error messages
- Rate limiting headers and retry guidance
- Permission error specificity
- Database error abstraction

**Acceptance Criteria:**
- [ ] All CRUD operations work correctly with proper validation
- [ ] Pagination handles large datasets efficiently
- [ ] Real-time status updates reflect actual job progress
- [ ] Export functionality works for all supported formats
- [ ] Rate limiting prevents abuse while allowing normal usage
- [ ] Error handling provides clear, actionable feedback
- [ ] Permission checks prevent unauthorized access
- [ ] API response times meet performance targets (<200ms)

**Files Created:**
- `packages/backend/src/controllers/research.controller.ts`
- `packages/backend/src/services/research.service.ts`
- `packages/backend/src/routes/research.routes.ts`
- `packages/backend/src/utils/export.utils.ts`
- `packages/backend/src/middleware/rate-limit.middleware.ts`

---

### C3. Comprehensive Frontend Research Interface
**Priority**: High | **Effort**: XL | **Dependencies**: C2, F1, F2

**Scope:**
- Create intuitive research submission form with advanced parameter options
- Implement comprehensive research dashboard with filtering and sorting
- Build detailed results view with multiple display formats
- Add real-time status tracking with WebSocket integration
- Implement export functionality and batch operations
- Ensure full accessibility compliance (WCAG AAA)

**Technical Implementation:**

**1. Advanced Research Submission Form:**
```typescript
interface ResearchFormData {
  query: {
    text: string;
    categories: string[];
    filters: SearchFilters;
  };
  parameters: SearchParameters;
  notification?: {
    webhook?: string;
    email?: boolean;
  };
}

const ResearchSubmissionForm: React.FC = () => {
  // Form implementation with:
  // - Multi-step wizard for complex queries
  // - Real-time validation feedback
  // - Auto-save to prevent data loss
  // - Preview of search parameters
  // - Estimated cost and time display
};
```

**Form Features:**
- **Query Builder**: Intuitive interface for complex search queries
- **Parameter Presets**: Save and reuse common search configurations
- **Cost Estimation**: Real-time estimation of API usage costs
- **Time Prediction**: Estimated completion time based on parameters
- **Validation Feedback**: Real-time input validation with helpful messages
- **Auto-save**: Prevent data loss during form completion

**2. Research Dashboard with Advanced Features:**
```typescript
const ResearchDashboard: React.FC = () => {
  // Dashboard implementation with:
  // - Real-time status updates via WebSocket
  // - Advanced filtering and sorting
  // - Bulk operations (cancel, export, duplicate)
  // - Search and saved searches
  // - Analytics and usage statistics
};
```

**Dashboard Features:**
- **Status Overview**: Visual summary of all research requests
- **Advanced Filters**: Status, date range, category, urgency filters
- **Saved Searches**: Store and recall filter combinations
- **Bulk Actions**: Select multiple items for batch operations
- **Real-time Updates**: Live status updates without page refresh
- **Usage Analytics**: Visual charts showing usage patterns
- **Quick Actions**: Duplicate, cancel, share research requests

**3. Comprehensive Results Display:**
```typescript
const ResearchResultsView: React.FC<{ researchId: string }> = () => {
  // Results implementation with:
  // - Multiple view formats (table, cards, list)
  // - Advanced sorting and filtering of results
  // - Product comparison functionality
  // - Export options with customizable fields
  // - Sharing and collaboration features
};
```

**Results Features:**
- **Multiple View Modes**: Table, card grid, detailed list views
- **Product Comparison**: Side-by-side comparison of selected products
- **Advanced Filtering**: Filter results by price, availability, supplier
- **Sorting Options**: Multiple sort criteria with custom ordering
- **Export Flexibility**: Choose fields and formats for export
- **Visual Indicators**: Clear status, availability, and quality indicators
- **Image Gallery**: Optimized product image display with lightbox
- **Supplier Insights**: Aggregated supplier information and ratings

**4. Real-time Progress Tracking:**
```typescript
const ProgressTracker: React.FC<{ researchId: string }> = () => {
  // Progress tracking with:
  // - Real-time WebSocket updates
  // - Visual progress indicators
  // - Detailed step information
  // - Error handling and retry options
  // - Estimated completion time
};
```

**Progress Features:**
- **Visual Progress Bar**: Shows completion percentage and current step
- **Step Details**: Detailed information about each processing phase
- **Time Estimates**: Dynamic ETA based on actual progress
- **Error Display**: Clear error messages with resolution guidance
- **Retry Mechanisms**: Easy retry options for failed requests
- **Cancellation**: Cancel running requests with confirmation

**5. Responsive Design & Accessibility:**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets, gesture support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **Color Accessibility**: High contrast ratios, colorblind-friendly
- **Reduced Motion**: Respect user motion preferences

**State Management Integration:**
```typescript
// RTK Query API definitions
const researchApi = createApi({
  reducerPath: 'researchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/research',
    prepareHeaders: (headers, { getState }) => {
      headers.set('authorization', `Bearer ${getToken(getState())}`);
      return headers;
    },
  }),
  tagTypes: ['Research'],
  endpoints: (builder) => ({
    getResearchList: builder.query<ResearchListResponse, ListParams>({
      query: (params) => ({ url: '', params }),
      providesTags: ['Research'],
    }),
    createResearch: builder.mutation<Research, CreateResearchRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: ['Research'],
    }),
    // Additional endpoints...
  }),
});
```

**WebSocket Integration for Real-time Updates:**
```typescript
const useRealTimeResearch = (researchId: string) => {
  const { data: research } = useGetResearchQuery(researchId);
  
  useEffect(() => {
    const ws = new WebSocket(`/api/v1/research/${researchId}/ws`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Update research status in real-time
    };
    
    return () => ws.close();
  }, [researchId]);
};
```

**Acceptance Criteria:**
- [ ] Users can submit complex research requests with all parameters
- [ ] Dashboard displays real-time status updates for all research
- [ ] Results view shows normalized data in multiple formats
- [ ] Export functionality works for all supported formats
- [ ] Real-time progress tracking updates without page refresh
- [ ] All screens responsive and accessible (WCAG AAA compliance)
- [ ] Performance meets targets: <2s initial load, <500ms interactions
- [ ] Error states handled gracefully with clear user guidance
- [ ] Offline functionality for viewing cached results
- [ ] Search and filtering work quickly on large result sets

**Files Created:**
- `packages/frontend/src/pages/ResearchDashboard.tsx`
- `packages/frontend/src/components/ResearchSubmissionForm.tsx`
- `packages/frontend/src/components/ResearchResultsView.tsx`
- `packages/frontend/src/components/ProgressTracker.tsx`
- `packages/frontend/src/hooks/useRealTimeResearch.ts`
- `packages/frontend/src/services/research.api.ts`
- `packages/frontend/src/utils/export.utils.ts`

---

## Performance Optimization

### Backend Performance
- **Database Optimization**: Efficient indexes, query optimization
- **Caching Strategy**: Redis caching for frequent queries
- **Pagination**: Cursor-based pagination for large datasets
- **API Response**: Compression, selective field loading

### Frontend Performance
- **Code Splitting**: Lazy load research components
- **Virtual Scrolling**: Handle large result sets efficiently
- **Image Optimization**: Lazy loading, responsive images
- **State Management**: Selective updates, normalized state

## Dependencies & Integration

**Depends On:**
- Epic A: Development infrastructure and containerized services
- Epic B: Authentication and authorization system
- MongoDB configured and indexed
- Redis for caching and real-time updates

**Enables:**
- Epic D: Research requests available for worker processing
- Epic E: Research completion events for webhook notifications
- Epic F: Research UI components integrated with design system
- Epic G: Research operations available for monitoring and metrics

## Risk Mitigation

- **Database Performance**: Comprehensive indexing and query optimization
- **Large Result Sets**: Pagination and virtual scrolling strategies
- **Real-time Updates**: Fallback polling if WebSocket fails
- **Export Performance**: Background processing for large exports
- **User Experience**: Progressive loading and skeleton screens

## Definition of Done

**Functional Validation:**
- [ ] Users can create, view, edit, and cancel research requests
- [ ] Real-time status updates work reliably
- [ ] Results display correctly with all normalized data
- [ ] Export functionality works for all formats (JSON, CSV, XLSX)
- [ ] Search and filtering perform well on large datasets
- [ ] Pagination handles datasets of 10,000+ items efficiently

**Performance Validation:**
- [ ] API endpoints respond in <200ms (95th percentile)
- [ ] Frontend pages load in <2s (95th percentile)
- [ ] Real-time updates have <1s latency
- [ ] Database queries optimized with proper index usage
- [ ] Frontend interactions respond in <100ms

**Quality Validation:**
- [ ] Test coverage >90% for research-related code
- [ ] All user inputs properly validated on client and server
- [ ] Error handling provides clear, actionable feedback
- [ ] Accessibility compliance verified (WCAG AAA)
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness verified on multiple devices

---

**Navigation:** [← Epic B - Auth](./02-epic-b-auth.md) | [Epic D - Worker →](./04-epic-d-worker.md)