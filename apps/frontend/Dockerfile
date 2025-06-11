FROM oven/bun:latest AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json ./
RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS build
COPY package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production
FROM oven/bun:alpine
WORKDIR /app
RUN bun install -g serve
RUN apk add --no-cache curl
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
