FROM node:20-alpine AS base

# DEVELOPMENT
FROM base AS dev

ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_WEBPACK_USEPOLLING=true

WORKDIR /app
COPY package*.json ./
RUN npm install
# COPY --from=deps /app/node_modules ./node_modules

COPY . .
EXPOSE 3000
CMD npm run dev

# PRODUCTION
FROM base AS prod

WORKDIR /app

ENV CI=true

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run ci-test


EXPOSE 3000
CMD node .next/standalone/server.js