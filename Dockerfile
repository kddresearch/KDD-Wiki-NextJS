FROM node:20-alpine AS base

EXPOSE 3000

# DEVELOPMENT
FROM base AS dev

ENV NEXT_TELEMETRY_DISABLED 1
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_WEBPACK_USEPOLLING=true

# Install Dependencies
WORKDIR /app
COPY . .
RUN npm install pnpm -g
RUN pnpm install --verbose

# Start Server
EXPOSE 3000
CMD pnpm run dev

# PRODUCTION
FROM base AS prod

WORKDIR /app

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXTAUTH_URL=https://kdd-wiki-website.azurewebsites.net/

# Install Dependencies
COPY . .
RUN npm install pnpm -g
RUN pnpm install --verbose

# Build and Test
RUN pnpm run build
RUN pnpm run ci-test

# Start Server
EXPOSE 3000
CMD pnpm run start