# [KDD Research Wiki](https://kddresearch.org/)

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

## Then

```bash
npm run dev
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

