# Multi-stage Dockerfile for Worker (BullMQ processor)

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
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/worker ./apps/worker
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Set working directory to worker app
WORKDIR /app/apps/worker

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
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/worker ./apps/worker
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Build the application
WORKDIR /app/apps/worker
RUN pnpm build

# Stage 3: Production
FROM node:24-alpine AS production

# Install tini for proper signal handling and create non-root user
RUN apk add --no-cache tini && \
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
COPY --chown=nodejs:nodejs apps/worker/package.json ./apps/worker/
COPY --chown=nodejs:nodejs packages/shared/package.json ./packages/shared/

# Install production dependencies only
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --prod --frozen-lockfile; \
    else \
        pnpm install --prod; \
    fi

# Copy built application from builder stage
COPY --chown=nodejs:nodejs --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --chown=nodejs:nodejs --from=builder /app/packages/shared/dist ./packages/shared/dist

# Switch to non-root user
USER nodejs

# Use tini for proper signal handling (important for graceful shutdown of BullMQ workers)
ENTRYPOINT ["/sbin/tini", "--"]

# Start the worker
CMD ["node", "apps/worker/dist/index.js"]