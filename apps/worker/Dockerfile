# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /workspace

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM deps AS builder
WORKDIR /workspace

COPY packages/config/ ./packages/config/
COPY apps/worker/ ./apps/worker/
COPY tsconfig.base.json ./

RUN pnpm turbo run build --filter=@procurement/worker

# Stage 3: Production deploy
FROM builder AS deployer
WORKDIR /workspace

RUN pnpm deploy --filter=@procurement/worker --prod /app

# Stage 4: Production runtime
FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=deployer /app /app
COPY --from=builder /workspace/apps/worker/dist /app/dist

ENV NODE_ENV=production
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4001/health || exit 1

CMD ["node", "dist/main.js"]
