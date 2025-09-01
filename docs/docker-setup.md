# Docker Development Environment

## Overview

This project uses Docker and Docker Compose to provide a complete, containerized development environment. All services are pre-configured and can be launched with a single command.

## Prerequisites

- Docker Engine 24.0+ 
- Docker Compose 2.20+
- 8GB+ RAM recommended
- 20GB+ free disk space

## Quick Start

1. **Clone the repository and navigate to project root**
   ```bash
   git clone <repository-url>
   cd procurement
   ```

2. **Copy environment variables**
   ```bash
   cp .env.sample .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker compose up -d
   ```

4. **Verify services are running**
   ```bash
   docker compose ps
   docker compose logs -f
   ```

## Services

### Core Services

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| Frontend | 3000 | React + Vite dev server | http://localhost:3000 |
| Backend | 8080 | Express API server | http://localhost:8080/health |
| Worker | - | BullMQ job processor | Via logs |
| MongoDB | 27017 | Database | `mongosh` connection |
| Redis | 6379 | Cache & Queue | `redis-cli ping` |
| Keycloak | 8180 | Identity Provider | http://localhost:8180 |

### Development Tools (Optional)

Launch with profile flag: `docker compose --profile dev-tools up -d`

| Tool | Port | Description |
|------|------|-------------|
| Mongo Express | 8081 | MongoDB UI |
| Redis Commander | 8082 | Redis UI |
| Bull Board | 3001 | Queue Dashboard |
| Mailhog | 8025 | Email Testing UI |

## Development Workflow

### Starting Services

```bash
# Start all core services
docker compose up -d

# Start with development tools
docker compose --profile dev-tools up -d

# Start specific services
docker compose up -d backend mongodb redis

# View logs
docker compose logs -f [service-name]
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Stop specific service
docker compose stop [service-name]
```

### Rebuilding Services

```bash
# Rebuild all services
docker compose build

# Rebuild specific service
docker compose build [service-name]

# Rebuild without cache
docker compose build --no-cache [service-name]
```

## Live Reload / Hot Module Replacement

All services support live reload:

- **Frontend**: Vite HMR enabled, changes reflect immediately
- **Backend**: Nodemon watches for changes, auto-restarts server
- **Worker**: Nodemon watches for changes, auto-restarts worker

Source code is mounted as volumes, so local changes are reflected in containers.

## Database Access

### MongoDB
```bash
# Connect via mongosh
docker exec -it procurement-mongodb mongosh -u admin -p password

# Use application database
use procurement

# Or connect from host
mongosh mongodb://admin:password@localhost:27017/procurement?authSource=admin
```

### Redis
```bash
# Connect via redis-cli
docker exec -it procurement-redis redis-cli

# Or from host
redis-cli -h localhost -p 6379
```

## Debugging

### Node.js Debugging

Backend and Worker services expose debugging ports:

- Backend: Port 9229
- Configure VSCode/WebStorm to attach to these ports

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Executing Commands in Containers

```bash
# Run shell in container
docker compose exec backend sh

# Run pnpm commands
docker compose exec backend pnpm test
docker compose exec frontend pnpm lint

# Install new packages
docker compose exec backend pnpm add express
```

## Troubleshooting

### Services Won't Start

1. Check port conflicts:
   ```bash
   lsof -i :3000 # Check if port is in use
   ```

2. Check Docker resources:
   ```bash
   docker system df
   docker system prune -a # Clean unused resources
   ```

3. Reset everything:
   ```bash
   docker compose down -v
   docker compose build --no-cache
   docker compose up -d
   ```

### Permission Issues

If you encounter permission issues with volumes:

```bash
# Fix ownership
sudo chown -R $(id -u):$(id -g) .

# Or run containers as current user
CURRENT_UID=$(id -u):$(id -g) docker compose up -d
```

### Memory Issues

Increase Docker memory allocation:
- Docker Desktop: Preferences > Resources > Memory
- Linux: Check `/etc/docker/daemon.json`

### Slow Performance on Windows/Mac

Enable:
- Docker Desktop: Use WSL2 backend (Windows)
- Docker Desktop: Use VirtioFS (Mac)

## Health Checks

All services include health checks. View status:

```bash
docker compose ps
# Look for (healthy) status

# Manual health check
curl http://localhost:8080/health
```

## Environment Variables

Key environment variables (see `.env.sample` for full list):

- `NODE_ENV`: Set to 'development' for dev features
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `SERPAPI_KEY`: Required for search functionality

## Security Notes

⚠️ **Development Configuration Only**

- Default passwords are for development only
- Keycloak runs in dev mode (not for production)
- CORS is permissive for development
- Rate limiting disabled by default

## Next Steps

1. Access Keycloak admin: http://localhost:8180 (admin/admin)
2. Configure realm and clients
3. Update `.env` with real API keys
4. Run database migrations/seeds
5. Start developing!

## Useful Commands

```bash
# View container resource usage
docker stats

# Clean everything
docker system prune -a --volumes

# Export/Import data
docker compose exec mongodb mongodump --out /backup
docker compose exec mongodb mongorestore /backup

# Network debugging
docker compose exec backend ping mongodb
docker compose exec backend nslookup redis
```