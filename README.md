# [KDD Research Wiki](https://kdd-wiki-website.azurewebsites.net/)

This is a wiki for the KDD Research Lab. 

**ONLY ACCESSABLE ON THE K-STATE NETWORK**
To access the website, you must be signed into the global protect vpn

## Getting Started

Install the proper tools:
- NodeJS
- Docker
- Azure CLI (Optional)

Next, fill out all the required secrets:

### /.env.local
```env
# Auth Secrets
AUTH_SECRET=
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=

AUTH_KSU_CLIENT_ID=
AUTH_KSU_CLIENT_SECRET=

# Postgress Database
DB_NAME=
DB_HOST=
DB_USERNAME=
DB_PASSWORD=

# Azure Blob Storage
BLOB_STORAGE_ACCOUNT_NAME=
BLOB_STORAGE_ACCOUNT_KEY=
BLOB_STORAGE_CONTAINER_NAME=
BLOB_STORAGE_DEVELOPMENT_URL=
```

## Run With Docker (Preferred)

Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) and restart your PC

Open the directory in the cli

### Development
```bash
docker-compose up --build kdd-wiki-dev
```

if 

### Production
```bash
docker-compose up --build kdd-wiki-prod
```

Open [your browser](http://localhost:3000) to see the result.

