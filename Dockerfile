ARG BUN_VERSION=canary-alpine
FROM oven/bun:$BUN_VERSION AS base
WORKDIR /app
ENV NODE_ENV=production

# Build frontend
FROM base AS frontend
COPY frontend/bun.lock /frontend/package.json ./
RUN bun install --ci
COPY frontend/. .
RUN bun run build

# Build backend
FROM base AS backend
COPY backend/bun.lock backend/package.json ./
RUN bun install --ci
COPY backend/. .

# Deploy
FROM base
COPY --from=frontend /app/dist frontend/dist
COPY --from=backend /app backend
WORKDIR /app/backend
EXPOSE 3000
CMD [ "bun", "run", "start" ]
