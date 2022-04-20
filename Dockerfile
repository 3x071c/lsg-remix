# Base image based on Alpine Linux + Node v17 for a very lean/small size and faster builds
FROM node:17-alpine as base
# Security reference: https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

# Default to production everything
ENV NODE_ENV production
# Best practices: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
ENV NPM_CONFIG_REFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Install dependencies via apk (Alpine's package manager) for prisma and security
RUN apk add --no-cache --update openssl dumb-init

# Install all package.json dependencies
FROM base as dev
WORKDIR /lsg

# Copy over package.json (and the lockfile) from the base image
COPY --chown=node package*.json .

# Install node-gyp dependencies on Alpine
RUN apk add --no-cache --update --virtual .gyp python3 make g++
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

# Generate prisma files
RUN npm run generate
# Run the postinstall hook (to setup Remix imports)
RUN npm run postinstall
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

# Security: switch to unpriviledged 'node' user
USER node
# Launch the production app! 🥳 (directly without the start script, to properly forward kernel signals)
CMD ["dumb-init", "node", ".remix/server/server.js"]
