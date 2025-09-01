# Infrastructure & Deployment

## M. Infrastructure & Deployment

### M.1 Development Environment

#### M.1.1 Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./packages/frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./packages/frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:4000
      - REACT_APP_KEYCLOAK_URL=http://localhost:8080

  backend:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    volumes:
      - ./packages/backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DOPPLER_TOKEN=${DOPPLER_TOKEN}
    depends_on:
      - mongodb
      - redis

  worker:
    build:
      context: ./packages/worker
      dockerfile: Dockerfile.dev
    volumes:
      - ./packages/worker:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DOPPLER_TOKEN=${DOPPLER_TOKEN}
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  keycloak:
    image: quay.io/keycloak/keycloak:22.0
    ports:
      - "8080:8080"
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
    command: start-dev

volumes:
  mongodb_data:
  redis_data:
```

### M.2 CI/CD Pipeline

#### M.2.1 GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Run linters
        run: pnpm lint
        
      - name: Run type checking
        run: pnpm type-check
        
      - name: Run tests
        run: pnpm test:ci
        
      - name: Generate coverage report
        run: pnpm coverage

  build-docker:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Frontend Image
        run: docker build -t pra-frontend:${{ github.sha }} ./packages/frontend
        
      - name: Build Backend Image
        run: docker build -t pra-backend:${{ github.sha }} ./packages/backend
        
      - name: Build Worker Image
        run: docker build -t pra-worker:${{ github.sha }} ./packages/worker
```

### M.3 Production Deployment (Future)

#### M.3.1 Kubernetes Architecture (Post-MVP)

```yaml
# Example Deployment Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pra-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pra-backend
  template:
    metadata:
      labels:
        app: pra-backend
    spec:
      containers:
      - name: backend
        image: pra-backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: DOPPLER_TOKEN
          valueFrom:
            secretKeyRef:
              name: doppler-secret
              key: token
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```