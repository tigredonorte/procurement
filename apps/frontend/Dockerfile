# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /workspace

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM deps AS builder
WORKDIR /workspace

COPY packages/ui/ ./packages/ui/
COPY packages/config/ ./packages/config/
COPY apps/frontend/ ./apps/frontend/
COPY tsconfig.base.json ./

RUN pnpm turbo run build --filter=@procurement/frontend

# Stage 3: Production runtime (nginx)
FROM nginx:alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
