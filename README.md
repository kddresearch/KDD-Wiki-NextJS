# KDD - Wiki - NextJS

This is the wiki for the KDD Research Lab. Rewritten in NextJS as the
framework, this wiki is aimed to me more maintainable and standardized
to the current webapp standards.

Includes a custom built WYSIWYG editor, full markdown support, and easy
extensibility for extra pages and features

**ONLY ACCESSIBLE ON THE K-STATE NETWORK**
To access the website, you must be signed into the global protect vpn

[KDDResearch.org](https://kdd-wiki-website.azurewebsites.net/)

## Installation

Install the proper tools:
- NodeJS 20+
- pnpm
- Docker

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

# OR load secrets from Azure
AZURE_KEY_VAULT_NAME=

AZURE_CLIENT_ID=
AZURE_TENANT_ID=
AZURE_CLIENT_SECRET=
```

## Usage

### Run With Docker (Preferred)

Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)
and restart your PC

Open the directory in the cli

### Development
```bash
docker compose up --build kdd-wiki-dev
```

### Production
```bash
docker compose up --build kdd-wiki-prod
```

Open [your browser](http://localhost:3000) to see the result.

## Contributing

If you would like to contribute to the KDD Wiki, fork the repository and follow
the styling guidelines for this project. Code is not guaranteed to be
accepted, but all contributions are welcome.

### Security

If you are reporting a vulnerability, follow the instructions in `SECURITY.md`

## Confidentiality: Public

> Access: Public Users

This repository should remain a public repository, inviting contributions and
letting others take advantage of the work done at KDD. This will be the first
project in the Open Source line-up for KDD Research.
