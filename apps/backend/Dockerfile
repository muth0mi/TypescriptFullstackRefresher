FROM oven/bun:latest AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

# Build
FROM deps AS build
COPY apps/backend/ ./apps/backend/
COPY packages/shared/ ./packages/shared/
WORKDIR /app/apps/backend
RUN bun run build

# Production
FROM oven/bun:alpine
WORKDIR /app
COPY --from=build /app/apps/backend/out/ .
EXPOSE 3000
CMD ["bun", "index.js"]
