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
RUN yarn install --verbose

# Start Server
EXPOSE 3000
CMD yarn run dev

# PRODUCTION
FROM base AS prod

WORKDIR /app

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXTAUTH_URL=https://kdd-wiki-website.azurewebsites.net/

# Install Dependencies
COPY . .
RUN yarn install --verbose
RUN yarn run build
RUN yarn run ci-test

# Start Server
EXPOSE 3000
CMD yarn run start