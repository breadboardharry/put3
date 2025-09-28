# ---------------------------------------------------------------------------- #
#                                  BASE IMAGE                                  #
# ---------------------------------------------------------------------------- #
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Use pnpm
RUN corepack enable

# ---------------------------------------------------------------------------- #
#                                  BUILD IMAGE                                 #
# ---------------------------------------------------------------------------- #
FROM base AS build-base
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts

# Build libs
RUN pnpm run -r --filter "./packages/**" build


# ---------------------------------------------------------------------------- #
#                                    CLIENT                                    #
# ---------------------------------------------------------------------------- #

# Build the client app
FROM build-base AS client-build
WORKDIR /usr/src/app
RUN pnpm run --filter "client" build

# Host the client app
FROM nginx:alpine AS client

# Remove default files
RUN rm -rf /usr/share/nginx/html/*
# Use custom nginx configuration
COPY --from=client-build /usr/src/app/apps/client/nginx.template.conf /etc/nginx/conf.d/config.template

# Copy app files
COPY --from=client-build /usr/src/app/apps/client/dist/put3/browser/ /usr/share/nginx/html
EXPOSE 80

# Set environment variables and restart nginx
CMD envsubst '${API_PATH} ${SOCKET_PATH}' < /usr/share/nginx/html/assets/config/env.template.json > /usr/share/nginx/html/assets/config/env.json && \
    envsubst '${ACCESS_ORIGIN} ${SERVER_PORT}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'

# ---------------------------------------------------------------------------- #
#                                    SERVER                                    #
# ---------------------------------------------------------------------------- #

# Build the server app
FROM build-base AS server-build
WORKDIR /usr/src/app
RUN pnpm run --filter "server" build
RUN pnpm deploy --filter=server --prod /prod/server

# Host the server app
FROM base AS server
COPY --from=server-build /prod/server /prod/server
WORKDIR /prod/server
# Delete source files (typescript)
RUN rm -rf src
ENV NODE_ENV=production
EXPOSE 3000