FROM node:20-alpine AS base

# remind me to never use docker again <3
# ENV AUTH_SECRET=$AUTH_SECRET \
#     AUTH_GOOGLE_CLIENT_ID=$AUTH_GOOGLE_CLIENT_ID \
#     AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GOOGLE_CLIENT_SECRET \
#     AUTH_KSU_CLIENT_ID=$AUTH_KSU_CLIENT_ID \
#     AUTH_KSU_CLIENT_SECRET=$AUTH_KSU_CLIENT_SECRET \
#     DB_NAME=$DB_NAME \
#     DB_HOST=$DB_HOST \
#     DB_USERNAME=$DB_USERNAME \
#     DB_PASSWORD=$DB_PASSWORD \
#     LOADED=$LOADED

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