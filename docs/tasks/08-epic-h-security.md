# Epic H — Comprehensive Security Hardening & Compliance

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Implement enterprise-grade security controls and hardening measures that protect against modern threats, ensure compliance with security standards, and establish a robust security posture suitable for production environments handling sensitive business data.

## Success Criteria
- Zero high or critical security vulnerabilities in production
- Pass external security assessments and penetration testing
- Achieve SOC 2 Type II compliance readiness
- Implement defense-in-depth security architecture
- Maintain <1% performance impact from security controls
- Complete security incident response procedures

## Technical Requirements

### Security Framework
- **Defense in Depth**: Multiple layers of security controls
- **Zero Trust Architecture**: Never trust, always verify principle
- **Compliance Standards**: SOC 2, GDPR, CCPA compliance preparation
- **Threat Modeling**: Comprehensive threat analysis and mitigation
- **Security Monitoring**: Real-time security event detection and response

## Tasks

### H1. Advanced API Security & Protection
**Priority**: Critical | **Effort**: L | **Dependencies**: B1, B2, G1

**Scope:**
- Implement comprehensive API security controls and hardening
- Set up advanced rate limiting with adaptive thresholds
- Configure security headers and CORS policies
- Implement input validation and sanitization
- Set up API security monitoring and threat detection

**Technical Implementation:**

**Comprehensive Security Headers:**
```typescript
const securityMiddleware = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
  
  cors: cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://app.requisio.com',
        'https://staging.requisio.com',
        ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400, // 24 hours
  }),
};
```

**Advanced Rate Limiting System:**
```typescript
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  adaptiveThreshold?: boolean;
}

class AdaptiveRateLimiter {
  private redis: Redis;
  private configs: Map<string, RateLimitConfig> = new Map();
  private adaptiveThresholds: Map<string, number> = new Map();
  
  constructor(redis: Redis) {
    this.redis = redis;
    this.setupEndpointConfigs();
  }
  
  private setupEndpointConfigs() {
    // Different limits for different endpoints
    this.configs.set('/api/v1/auth/login', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      keyGenerator: (req) => `login:${req.ip}`,
      skipSuccessfulRequests: false,
      adaptiveThreshold: false,
    });
    
    this.configs.set('/api/v1/research', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 100,
      keyGenerator: (req) => `research:${req.user?.id || req.ip}`,
      skipSuccessfulRequests: true,
      adaptiveThreshold: true,
    });
    
    this.configs.set('/api/v1/webhooks/test', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10,
      keyGenerator: (req) => `webhook-test:${req.user?.id}`,
      adaptiveThreshold: false,
    });
  }
  
  async checkRateLimit(req: Request): Promise<RateLimitResult> {
    const endpoint = this.getEndpointPattern(req.path);
    const config = this.configs.get(endpoint) || this.getDefaultConfig();
    const key = config.keyGenerator(req);
    
    const current = await this.redis.get(key);
    const requests = current ? parseInt(current) : 0;
    
    // Adaptive threshold adjustment based on system load
    let effectiveLimit = config.maxRequests;
    if (config.adaptiveThreshold) {
      effectiveLimit = this.adjustThresholdBasedOnLoad(endpoint, config.maxRequests);
    }
    
    if (requests >= effectiveLimit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: await this.getReset(key),
        retryAfter: Math.ceil(config.windowMs / 1000),
      };
    }
    
    // Increment counter
    await this.redis.multi()
      .incr(key)
      .expire(key, Math.ceil(config.windowMs / 1000))
      .exec();
    
    return {
      allowed: true,
      remaining: effectiveLimit - requests - 1,
      resetTime: Date.now() + config.windowMs,
    };
  }
  
  private adjustThresholdBasedOnLoad(endpoint: string, baseLimit: number): number {
    // Implement adaptive thresholds based on system metrics
    const systemLoad = this.getCurrentSystemLoad();
    const errorRate = this.getCurrentErrorRate(endpoint);
    
    let multiplier = 1.0;
    
    // Reduce limits under high load
    if (systemLoad > 0.8) multiplier *= 0.5;
    else if (systemLoad > 0.6) multiplier *= 0.7;
    
    // Reduce limits during high error rates
    if (errorRate > 0.1) multiplier *= 0.6;
    
    return Math.floor(baseLimit * multiplier);
  }
}

// Rate limiting middleware
const rateLimitMiddleware = (rateLimiter: AdaptiveRateLimiter) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rateLimiter.checkRateLimit(req);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', result.remaining + 1);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      
      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        });
      }
      
      next();
    } catch (error) {
      // Log error but don't block requests if rate limiter fails
      req.logger?.error('Rate limiter error', error);
      next();
    }
  };
};
```

**Comprehensive Input Validation:**
```typescript
class SecurityValidator {
  static sanitizeInput(input: any, schema: z.ZodSchema): any {
    try {
      // First, sanitize strings to prevent XSS
      const sanitized = this.deepSanitize(input);
      
      // Then validate with Zod schema
      const validated = schema.parse(sanitized);
      
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Input validation failed', error.errors);
      }
      throw error;
    }
  }
  
  private static deepSanitize(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize keys as well
        const sanitizedKey = this.sanitizeString(key);
        sanitized[sanitizedKey] = this.deepSanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  }
  
  private static sanitizeString(str: string): string {
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  
  static validateFileUpload(file: any): FileValidationResult {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'text/csv',
      'application/json',
    ];
    
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'File type not allowed',
        code: 'INVALID_FILE_TYPE',
      };
    }
    
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: 'File too large',
        code: 'FILE_TOO_LARGE',
      };
    }
    
    // Check for malicious content
    if (this.containsMaliciousContent(file.buffer)) {
      return {
        valid: false,
        error: 'File contains malicious content',
        code: 'MALICIOUS_CONTENT',
      };
    }
    
    return { valid: true };
  }
}
```

**Acceptance Criteria:**
- [ ] Comprehensive security headers implemented
- [ ] Advanced rate limiting prevents abuse
- [ ] All inputs validated and sanitized
- [ ] CORS configured for production security
- [ ] File upload security implemented
- [ ] API security monitoring operational
- [ ] Performance impact <5% for security controls

---

### H2. Data Security & Encryption
**Priority**: Critical | **Effort**: M | **Dependencies**: A3, G1

**Scope:**
- Implement comprehensive data encryption at rest and in transit
- Set up secure key management and rotation
- Configure database security and access controls
- Implement secure backup and recovery procedures
- Set up data classification and handling policies

**Technical Implementation:**

**Encryption at Rest:**
```typescript
class DataEncryption {
  private encryptionKey: Buffer;
  private algorithm = 'aes-256-gcm';
  
  constructor() {
    this.encryptionKey = this.deriveKeyFromMaster();
  }
  
  encryptSensitiveData(data: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    cipher.setAAD(Buffer.from('requisio-platform', 'utf8'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.algorithm,
    };
  }
  
  decryptSensitiveData(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(
      encryptedData.algorithm, 
      this.encryptionKey
    );
    
    decipher.setAAD(Buffer.from('requisio-platform', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Database field encryption
const encryptedFieldPlugin = (schema: Schema) => {
  schema.pre('save', function(this: any) {
    const encryptedFields = this.schema.paths;
    
    Object.keys(encryptedFields).forEach(path => {
      if (encryptedFields[path].options.encrypted && this.isModified(path)) {
        const value = this.get(path);
        if (value) {
          this.set(path, dataEncryption.encryptSensitiveData(value));
        }
      }
    });
  });
  
  schema.post('find', function(docs: any[]) {
    docs.forEach(doc => {
      Object.keys(doc.schema.paths).forEach(path => {
        if (doc.schema.paths[path].options.encrypted) {
          const encryptedValue = doc.get(path);
          if (encryptedValue) {
            const decrypted = dataEncryption.decryptSensitiveData(encryptedValue);
            doc.set(path, decrypted);
          }
        }
      });
    });
  });
};
```

**Secure Key Management:**
```typescript
class KeyManagementService {
  private doppler: DopplerClient;
  private keyRotationSchedule: Map<string, Date> = new Map();
  
  async rotateEncryptionKeys(): Promise<void> {
    const keys = await this.doppler.getSecrets(['ENCRYPTION_KEY', 'JWT_SECRET']);
    
    for (const [keyName, currentKey] of Object.entries(keys)) {
      const lastRotation = this.keyRotationSchedule.get(keyName);
      const rotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
      
      if (!lastRotation || Date.now() - lastRotation.getTime() > rotationInterval) {
        await this.rotateKey(keyName, currentKey);
      }
    }
  }
  
  private async rotateKey(keyName: string, currentKey: string): Promise<void> {
    // Generate new key
    const newKey = this.generateSecureKey(256);
    
    // Update in Doppler with versioning
    await this.doppler.updateSecret(keyName, newKey);
    await this.doppler.updateSecret(`${keyName}_PREVIOUS`, currentKey);
    
    // Update rotation schedule
    this.keyRotationSchedule.set(keyName, new Date());
    
    // Notify services of key rotation
    await this.notifyServicesOfKeyRotation(keyName);
  }
  
  private generateSecureKey(bits: number): string {
    return crypto.randomBytes(bits / 8).toString('hex');
  }
}
```

**Database Security Configuration:**
```typescript
// MongoDB security configuration
const mongoSecurityConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  sslCA: process.env.MONGODB_CA_CERT,
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-256',
  readPreference: 'secondaryPreferred',
  retryWrites: true,
  w: 'majority',
  journal: true,
};

// Connection with proper error handling
class SecureDatabase {
  private connection: Connection;
  private auditLogger: AuditLogger;
  
  async connect(): Promise<void> {
    try {
      this.connection = await mongoose.createConnection(
        process.env.MONGODB_URL!,
        mongoSecurityConfig
      );
      
      // Set up audit logging
      this.setupAuditLogging();
      
      // Set up connection monitoring
      this.setupConnectionMonitoring();
      
    } catch (error) {
      this.auditLogger.logSecurityEvent('database_connection_failed', {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
  
  private setupAuditLogging(): void {
    // Log all database operations for sensitive collections
    const sensitiveCollections = ['users', 'research_requests', 'webhook_configs'];
    
    sensitiveCollections.forEach(collection => {
      this.connection.collection(collection).watch().on('change', (change) => {
        this.auditLogger.logDataAccess({
          collection,
          operation: change.operationType,
          documentId: change.documentKey?._id,
          timestamp: new Date().toISOString(),
          userId: this.getCurrentUserId(),
        });
      });
    });
  }
}
```

**Acceptance Criteria:**
- [ ] All sensitive data encrypted at rest
- [ ] TLS 1.3 enforced for all communications
- [ ] Automatic key rotation implemented
- [ ] Database access properly secured and audited
- [ ] Backup encryption and secure storage
- [ ] Data classification policies implemented
- [ ] Compliance with encryption standards

---

### H3. Advanced Threat Protection & Abuse Prevention
**Priority**: High | **Effort**: M | **Dependencies**: H1, H2, G1

**Scope:**
- Implement advanced threat detection and prevention
- Set up abuse prevention and anomaly detection
- Configure automated incident response
- Implement security event correlation
- Set up threat intelligence integration

**Technical Implementation:**

**Threat Detection System:**
```typescript
class ThreatDetectionService {
  private anomalyDetector: AnomalyDetector;
  private threatIntelligence: ThreatIntelligence;
  private incidentResponse: IncidentResponse;
  
  async analyzeRequest(req: Request): Promise<ThreatAssessment> {
    const assessment: ThreatAssessment = {
      riskScore: 0,
      threats: [],
      recommendations: [],
    };
    
    // Check IP reputation
    const ipThreat = await this.checkIPThreat(req.ip);
    if (ipThreat.malicious) {
      assessment.riskScore += 80;
      assessment.threats.push({
        type: 'malicious_ip',
        severity: 'high',
        details: ipThreat,
      });
    }
    
    // Analyze request patterns
    const behaviorThreat = await this.analyzeBehaviorPattern(req);
    assessment.riskScore += behaviorThreat.riskScore;
    
    // Check for known attack patterns
    const attackPattern = this.detectAttackPatterns(req);
    if (attackPattern.detected) {
      assessment.riskScore += attackPattern.severity;
      assessment.threats.push(attackPattern);
    }
    
    // Generate recommendations
    if (assessment.riskScore > 70) {
      assessment.recommendations.push('Block request immediately');
      await this.incidentResponse.triggerSecurityIncident(assessment);
    } else if (assessment.riskScore > 40) {
      assessment.recommendations.push('Apply additional verification');
    }
    
    return assessment;
  }
  
  private detectAttackPatterns(req: Request): AttackPattern {
    const patterns = {
      sqlInjection: /('|(\-\-)|(;)|(\||\|)|(\/\*|\*\/))/i,
      xss: /<[^>]*script[^>]*>/i,
      directoryTraversal: /(\.\.\/|\.\.\\/)/,
      commandInjection: /(;|\||&|`|\$\(|\$\{)/,
    };
    
    const requestString = JSON.stringify({
      url: req.url,
      body: req.body,
      query: req.query,
      headers: req.headers,
    });
    
    for (const [patternName, regex] of Object.entries(patterns)) {
      if (regex.test(requestString)) {
        return {
          detected: true,
          type: patternName,
          severity: 90,
          details: `Detected ${patternName} attack pattern`,
        };
      }
    }
    
    return { detected: false, severity: 0 };
  }
}

// Security middleware
const securityAnalysisMiddleware = (threatDetection: ThreatDetectionService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assessment = await threatDetection.analyzeRequest(req);
      
      // Add security context to request
      req.securityContext = {
        riskScore: assessment.riskScore,
        threats: assessment.threats,
        timestamp: Date.now(),
      };
      
      // Block high-risk requests
      if (assessment.riskScore > 70) {
        return res.status(403).json({
          error: 'Request blocked by security policy',
          code: 'SECURITY_BLOCK',
        });
      }
      
      // Add security headers
      res.setHeader('X-Security-Score', assessment.riskScore.toString());
      
      next();
    } catch (error) {
      req.logger?.error('Security analysis failed', error);
      next(); // Don't block on security analysis failure
    }
  };
};
```

**Automated Incident Response:**
```typescript
class IncidentResponse {
  private alertManager: AlertManager;
  private securityTeam: SecurityTeam;
  private automation: SecurityAutomation;
  
  async triggerSecurityIncident(assessment: ThreatAssessment): Promise<void> {
    const incident: SecurityIncident = {
      id: uuidv4(),
      severity: this.calculateSeverity(assessment.riskScore),
      type: this.categorizeThreats(assessment.threats),
      timestamp: new Date().toISOString(),
      status: 'active',
      assessment,
    };
    
    // Immediate automated response
    await this.automation.executeImmediateResponse(incident);
    
    // Alert security team
    await this.alertManager.sendSecurityAlert(incident);
    
    // Log incident
    await this.logSecurityIncident(incident);
    
    // Start investigation workflow
    await this.startInvestigation(incident);
  }
  
  private async executeImmediateResponse(incident: SecurityIncident): Promise<void> {
    switch (incident.severity) {
      case 'critical':
        await this.blockIPAddress(incident.assessment.sourceIP);
        await this.lockUserAccount(incident.assessment.userId);
        await this.escalateToOnCall();
        break;
        
      case 'high':
        await this.increaseMonitoring(incident.assessment.sourceIP);
        await this.requireAdditionalAuth(incident.assessment.userId);
        break;
        
      case 'medium':
        await this.logSuspiciousActivity(incident);
        break;
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Advanced threat detection operational
- [ ] Automated incident response procedures
- [ ] Security event correlation and analysis
- [ ] Threat intelligence integration
- [ ] Abuse prevention mechanisms
- [ ] Security monitoring dashboards
- [ ] Incident response procedures documented and tested

**Done when:** Zero critical vulnerabilities; external security assessment passed; comprehensive security monitoring operational; incident response procedures tested.

---

**Navigation:** [← Epic G - Observability](./07-epic-g-observability.md) | [Epic I - Documentation →](./09-epic-i-documentation.md)