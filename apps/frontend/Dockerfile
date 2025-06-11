FROM oven/bun:latest AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

# Build
FROM deps AS build
COPY apps/frontend/ ./apps/frontend/
COPY apps/backend/ ./apps/backend/
COPY packages/shared/ ./packages/shared/
WORKDIR /app/apps/frontend
RUN bun run build

# Production
FROM oven/bun:alpine
WORKDIR /app
COPY --from=build /app/apps/frontend/dist .
EXPOSE 3000
CMD ["bunx", "serve", "-s", "./", "-l", "3000"]
