# [KDD Research Wiki](https://kdd-wiki-website.azurewebsites.net/)

This is a wiki for the KDD Research Lab.

## Getting Started

First, fill out all the required secrets:

```env
# .env.local

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
```

## Docker

Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) and restart your PC

Open the directory in the cli

### Development
```bash
docker-compose up --build kdd-wiki-dev
```

### Production
```bash
docker-compose up --build kdd-wiki-prod
```

# Test/Builds

To build
```bash
npm run build
```

To run tests
```bash
npm run tests
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

