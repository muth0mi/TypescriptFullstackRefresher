FROM oven/bun:latest AS base
WORKDIR /app

# Backend
FROM base AS be-install
COPY apps/backend/bun.lock backend/package.json ./
RUN bun install --frozen-lockfile
FROM base AS be-build
COPY --from=be-install /app/node_modules node_modules
COPY apps/backend/. .
RUN bun run build

# Frontend
FROM base AS fe-install
COPY apps/frontend/bun.lock frontend/package.json ./
RUN bun install --frozen-lockfile
FROM base AS fe-build
COPY --from=fe-install /app/node_modules node_modules
COPY apps/frontend/. .
RUN bun run build

# Deploy
FROM oven/bun:alpine
COPY --from=be-build /app/out .
COPY --from=fe-build /app/dist ../frontend/dist
EXPOSE 3000
CMD [ "bun", "index.js" ]
