# Deployment Guide

This guide covers how to deploy the TypeScript Fullstack application using Docker Compose for easy setup and scaling.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Services](#services)
- [Environment Configuration](#environment-configuration)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd TypescriptFullstackRefresher

# Copy environment file
cp .env.example .env

# Edit environment variables (see Environment Configuration section)
vim .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

That's it! Your application will be available at:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## Services

The `docker-compose.yml` includes the following services:

### 🗄️ PostgreSQL Database
- **Port**: 5432
- **Purpose**: Main application database
- **Data**: Persisted in `postgres_data` volume

### 🚀 Backend API
- **Port**: 3000
- **Technology**: Bun + Hono
- **Features**: REST API, Authentication, Database ORM
- **Health Check**: `/health` endpoint

### 🌐 Frontend Web App
- **Port**: 3001 (external)
- **Technology**: React + Vite served by npx serve
- **Features**: SPA routing, Modern UI, Authentication



## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
POSTGRES_DB=app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/app

# Kinde Authentication
KINDE_DOMAIN=your-domain.kinde.com
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_REDIRECT_URI=http://localhost:3000/api/auth/callback
KINDE_LOGOUT_REDIRECT_URI=http://localhost:3000

# API Configuration
PORT=3000
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=http://localhost:3000/api
```

### Production Environment

For production deployments, update the URLs:

```env
# Production API URL
VITE_API_URL=https://api.yourdomain.com

# Secure database connection
DATABASE_URL=postgresql://user:password@db.yourdomain.com:5432/app

# Production auth URLs
KINDE_REDIRECT_URI=https://api.yourdomain.com/api/auth/callback
KINDE_LOGOUT_REDIRECT_URI=https://yourdomain.com
```

## Scaling

### Scale Individual Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Scale frontend to 2 instances (with load balancer)
docker-compose up -d --scale frontend=2
```

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## Monitoring

### Health Checks

All services include health checks managed by Docker Compose:

- **PostgreSQL**: Uses `pg_isready` to check database availability
- **Backend**: Checks `/health` endpoint with curl
- **Frontend**: Checks if serve is responding with curl

```bash
# Check all services health
docker-compose ps

# View health status
docker inspect --format='{{json .State.Health}}' <container-name>

# Health checks enable proper service dependencies
# Backend waits for PostgreSQL to be healthy
# Frontend waits for Backend to be healthy
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View logs with timestamps
docker-compose logs -f -t
```

### Service Status

```bash
# List running services
docker-compose ps

# Show resource usage
docker stats

# Show detailed service info
docker-compose top
```

## Troubleshooting

### Common Commands

```bash
# Restart all services
docker-compose restart

# Rebuild and restart services
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a
```

### Common Issues

#### Services Won't Start

```bash
# Check service logs
docker-compose logs <service-name>

# Check environment variables
docker-compose exec backend env | grep -E "(DATABASE|KINDE)"

# Rebuild specific service
docker-compose up -d --build <service-name>
```

#### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Test database connection from backend
docker-compose exec backend bun -e "console.log(process.env.DATABASE_URL)"

# Connect to database directly
docker-compose exec postgres psql -U postgres -d app
```

#### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Verify build output
docker-compose exec frontend ls -la /app/dist

# Check if serve is running
docker-compose exec frontend ps aux | grep serve
```

#### Port Conflicts

If you have port conflicts, update the ports in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3000"  # Change external port
  frontend:
    ports:
      - "3003:3000"  # Change external port
```

### Performance Optimization

#### Database
- Add connection pooling
- Configure appropriate `shared_buffers` and `work_mem`
- Add database indexes for frequently queried fields

#### Backend
- Enable API response compression
- Implement request rate limiting
- Add caching layer if needed

#### Frontend
- Use CDN for static assets
- Enable service worker for caching
- Implement code splitting

### Security Best Practices

- Use strong passwords in environment variables
- Enable SSL/TLS in production
- Implement proper CORS configuration
- Regular security updates for base images
- Use secrets management for sensitive data
- Network segmentation with Docker networks

## Production Deployment

### Production Checklist

- [ ] Environment variables configured for production
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Monitoring and alerting setup
- [ ] Log aggregation configured
- [ ] Security scanning enabled
- [ ] Load balancer configured
- [ ] Auto-scaling configured

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d --build
```

### Docker Swarm (Optional)

For advanced orchestration:

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml app-stack

# Scale services
docker service scale app-stack_backend=3
```

## Development

### Local Development

```bash
# Start in development mode with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs in real-time
docker-compose logs -f backend frontend
```

### Database Migrations

```bash
# Run database migrations
docker-compose exec backend bun run db:migrate

# Generate new migration
docker-compose exec backend bun run db:generate

# Open database studio
docker-compose exec backend bun run db:studio
```

That's it! Your TypeScript fullstack application should now be running smoothly with Docker Compose. 🚀