# Static Hosting PoC Round 3 - Building frameworks and backend/workers separation

## Overview
This project is a proof of concept (PoC) for static hosting with a focus on building frameworks and separating backend and worker functionalities. The project supports building frontend frameworks as well as static sites, and it leverages various technologies to achieve this.

## Features

- **Frontend Frameworks and Static Sites**: Supports building both frontend frameworks and static sites.
- **Backend and Worker Separation**: Separates backend and worker functionalities for better scalability and maintainability.
- **Database Integration**: Saves project and build information and logs in a database.
- **Queue Management**: Uses Redis and BullMQ for communication between the backend and the workers.
- **Docker in Docker (DinD)**: Worker uses DinD pattern to create a container to build the projects on demand.
- **Azure Deployment**: Deploys files on Microsoft Azure.
- **Kubernetes Deployment**: Full Kubernetes deployment for container orchestration.
- **Dockerized**: Completely dockerized for easy deployment and management.


## Technologies Used

- **Azure Blob Storage**: For storing build outputs.
- **Prisma**: For database ORM.
- **Redis and BullMQ**: For queue management and communication between backend and workers.
- **TypeScript**: For type-safe JavaScript.
- **Docker**: For containerization.
- **Kubernetes**: For container orchestration.

## Demo Video

https://youtu.be/wj-VoOoVZYw

## Architecture

### Main Architecture

![main](./docs/main.png)

### Worker Architecture

![worker](./docs/worker.png)

### Database Schema

![schema](./docs/schema.png)

### Components
1. Backend Service (backend/src/index.ts)
    - Handles HTTP requests
    - Manages database operations
    - Coordinates build jobs

2. Worker Service (worker/src/index.ts)
    - Processes build jobs
    - Executes builds in isolated containers
    - Uploads build artifacts to Azure

3. Database (backend/prisma/schema.prisma)
    - PostgreSQL database
    - Stores project and build information
    - Managed through Prisma ORM

4. Message Queue
    - Redis with BullMQ
    - Handles job queuing and communication

5. Web Server (web-server)
    - Routes the generated deployment URLs to the Azure Blob Storage

## Setup and Deployment

Prerequisites

- Azure account and either:
    - Docker and Docker Compose (run on docker)
    - Kubernetes cluster (run on kubernetes)
    - Node.js, Redis, PostgreSQL (run locally)

Environment Variables

```bash
    DATABASE_URL=postgresql://user:password@localhost:5432/mydb
    REDIS_HOST=localhost
    REDIS_PORT=6379
    AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
    AZURE_CLIENT_ID=your_client_id
    AZURE_CLIENT_SECRET=your_client_secret
    AZURE_TENANT_ID=your_tenant_id
```

### Local Development

1. Start dependencies:

    ```bash
    docker-compose -f docker-compose-database.yml -f docker-compose-queue.yml up -d
    ```

2. Install dependencies and start services:

    ```
    # Backend
    cd backend
    npm install
    npm run dev

    # Worker
    cd worker
    npm install
    npm run dev
    ```

3. Access the backend at http://localhost:3000

### Docker Deployment

```bash
docker-compose up --build
```

### Kubernetes Deployment

```bash
kubectl apply -f kubernetes-files/
```

## API Endpoints

User Management
- `POST /user` - Create user
- `GET /user/:id` - Get user details

Project Management
- `POST /project/new` - Create new project
- `GET /project/:id/builds` - Get project builds
- `POST /project/:id/build` - Trigger new build

## Test Examples

1. Static project
    ```
    Repository URL: https://github.com/codingstella/vCard-personal-portfolio
    
    Branch: main
    ```
2. Multi-page static project
    ```
    Repository URL: https://github.com/vanzasetia/designo-multi-page-website
    
    Branch: main
    ```
3. Another Multi-page static project
    ```
    Repository URL: https://github.com/SayeedaSaima/Full-Responsive-Multi-Page-Website
    
    Branch: main
    ```
4. React project
    ```
    Repository URL: https://github.com/nightknighto/MyReads-Book-Library
    
    Branch: master
    
    Build Command: npm run build
    
    Output Directory: build
    ```
5. Weather React project (note: no API key)
    ```
    Repository URL: https://github.com/s-shemmee/React-Weather-App
    
    Branch: main
    
    Build Command: npm run build
    
    Output Directory: build
    ```