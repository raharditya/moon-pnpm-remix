FROM node:20-alpine AS base
WORKDIR /builder

RUN npm install -g @moonrepo/cli pnpm

FROM base AS workspace
WORKDIR /builder

COPY . .
RUN moon docker scaffold web

FROM base AS builder

COPY --from=workspace /builder/.moon/docker/workspace .
RUN moon docker setup
COPY --from=workspace /builder/.moon/docker/sources .
# need to remove .git manually since moon v1.16.0, or else the build will always fail
RUN rm -rf .git
RUN moon web:build
RUN moon docker prune

FROM base
WORKDIR /app

COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/package.json ./package.json
COPY --from=builder /builder/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /builder/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /builder/apps/web/package.json ./apps/web/package.json
COPY --from=builder /builder/apps/web/build ./apps/web/build

CMD node ./apps/web/build/index.js
