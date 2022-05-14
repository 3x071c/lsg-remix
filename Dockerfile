# Base image based on Alpine Linux + Node v17 for a very lean/small size and faster builds
FROM node:18-alpine as base
# Security reference: https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

# Default to production everything
ENV NODE_ENV production
# Best practices: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_PATH=/home/node/.npm-global/lib/node_modules

# Install dependencies via apk (Alpine's package manager) for prisma and security
RUN apk add --no-cache --update openssl dumb-init

# Install all package.json dependencies
FROM base as dev
WORKDIR /lsg

# Copy over package.json (and the lockfile) from the base image
COPY --chown=node package*.json .

# Install node-gyp dependencies on Alpine
RUN apk add --no-cache --update --virtual .gyp python3 make g++
# Don't run hooks unnecessarily
RUN npm set-script prepare ""
RUN npm set-script preinstall ""
RUN npm set-script postinstall ""
# Install all production dependencies "cleanly", i.e. from the lockfile (not modifying it)
RUN npm ci --production=false
# Clean up the node-gyp install
RUN apk del .gyp

# package.json production dependencies (only)
FROM base as prod
WORKDIR /lsg

# Copy over package.json (and the lockfile) from the base image
COPY --chown=node package*.json .
# Copy over the node_modules from the previous stage
COPY --chown=node --from=dev /lsg/node_modules /lsg/node_modules

# Prune/Remove all non-production (development) dependencies installed
RUN npm prune --production

# Build the production app
FROM base as build
WORKDIR /lsg

# Copy over the installed production node_modules from the previous stage
COPY --chown=node --from=dev /lsg/node_modules /lsg/node_modules
# Copy over all source files from the base image
COPY --chown=node . .

# Run the build script
RUN npm run build

# Tie previous stages together into a tiny production app image
FROM base as app
WORKDIR /lsg

# Copy over the installed production node_modules (again)
COPY --chown=node --from=prod /lsg/node_modules /lsg/node_modules
# Copy over the generated prisma files
COPY --chown=node --from=build /lsg/node_modules/.prisma /lsg/node_modules/.prisma
# Copy over the built Remix server files from the previous stage
COPY --chown=node --from=build /lsg/.remix/server /lsg/.remix/server
# Copy over the public folder, which contains static resources
COPY --chown=node --from=build /lsg/public /lsg/public
# Copy over all source files, to make the release step work
COPY --chown=node . .

# Security: switch to unprivileged 'node' user
USER node
# Launch the production app! 🥳 (directly without the start script, to properly forward kernel signals)
CMD ["dumb-init", "node", ".remix/server/server.js"]
