FROM node:16-alpine as install_dependency
RUN apk add --no-cache \
    python3 \
    build-base

WORKDIR /develop
COPY package* .
RUN npm i

WORKDIR /production
COPY package* .
RUN npm ci --production

FROM install_dependency as build
WORKDIR /develop

COPY server ./server
COPY tsconfig* .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app

COPY --from=build /develop/dist ./dist
COPY --from=install_dependency /production/node_modules ./node_modules
COPY package* .

CMD npm run start
