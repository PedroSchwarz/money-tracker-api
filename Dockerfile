# Build
FROM node:18-alpine AS build
WORKDIR /usr/src/app

# A wildcard ensures package.json AND package-lock.json are copied
COPY package*.json ./

# Install project dependencies
RUN npm ci

COPY . .

RUN npm run build && npm prune --production

# Production
FROM node:18-alpine AS production
WORKDIR /usr/src/app

COPY  --from=build usr/src/app/dist ./dist
COPY  --from=build usr/src/app/node_modules ./node_modules

EXPOSE 3000/tcp

CMD [ "node", "dist/main.js" ]