FROM node:12 as builder

ADD ./package*.json  /app/
WORKDIR /app

RUN npm ci

COPY . /app
RUN npm run build
RUN npm prune --production

FROM node:12-alpine as runner

USER node

COPY --from=builder --chown=node /app/package.json /app/package.json
COPY --from=builder --chown=node /app/dist /app/dist
COPY --from=builder --chown=node /app/node_modules /app/node_modules
# COPY --from=builder --chown=node /app/docs /app/docs

WORKDIR /app

CMD ["node", "/app/dist/main.js"]
