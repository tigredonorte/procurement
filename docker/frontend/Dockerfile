# Multi-stage Dockerfile for Frontend (React + Vite)

# Stage 1: Development
FROM node:24-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Copy package.json files for all workspaces
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Expose development server port
EXPOSE 3000

# Set working directory to frontend app
WORKDIR /app/apps/frontend

# Development command with hot reload
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Stage 2: Build
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
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

# Copy application source
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Build the application
WORKDIR /app/apps/frontend
RUN pnpm build

# Stage 3: Production
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]