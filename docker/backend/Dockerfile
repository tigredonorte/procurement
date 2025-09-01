# Multi-stage Dockerfile for Backend (Node.js + Express)

# Stage 1: Development
FROM node:24-alpine AS development

# Install pnpm and development tools
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Copy package.json files for all workspaces
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Expose API port
EXPOSE 8080

# Set working directory to backend app
WORKDIR /app/apps/backend

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Development command with ts-node and hot reload
CMD ["pnpm", "dev"]

# Stage 2: Builder
FROM node:24-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Copy package.json files for all workspaces
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Build the application
WORKDIR /app/apps/backend
RUN pnpm build

# Stage 3: Production
FROM node:24-alpine AS production

# Install curl for health checks and create non-root user
RUN apk add --no-cache curl tini && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs pnpm-lock.yaml* ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for production
COPY --chown=nodejs:nodejs apps/backend/package.json ./apps/backend/
COPY --chown=nodejs:nodejs packages/shared/package.json ./packages/shared/

# Install production dependencies only
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --prod --frozen-lockfile; \
    else \
        pnpm install --prod; \
    fi

# Copy built application from builder stage
COPY --chown=nodejs:nodejs --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --chown=nodejs:nodejs --from=builder /app/packages/shared/dist ./packages/shared/dist

# Switch to non-root user
USER nodejs

# Expose API port
EXPOSE 8080

# Health check for production
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "apps/backend/dist/index.js"]