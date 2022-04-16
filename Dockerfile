# base node image
FROM node:16-alpine as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /lsg

ADD package.json package-lock.json ./
RUN npm ci

# Setup production node_modules
FROM base as production-deps

WORKDIR /lsg

COPY --from=deps /lsg/node_modules /lsg/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /lsg

COPY --from=deps /lsg/node_modules /lsg/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /lsg

COPY --from=production-deps /lsg/node_modules /lsg/node_modules

COPY --from=build /lsg/.remix/server /lsg/.remix/server
COPY --from=build /lsg/public /lsg/public
ADD . .

CMD ["npm", "start"]
