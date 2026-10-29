# Build
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The commit this image was built from, shown in the footer. Passed in: the
# build context has no .git (see .dockerignore). Unset gives an unmarked build.
ARG GIT_SHA=""
ENV GIT_SHA=$GIT_SHA

RUN npm run build

FROM nginx:1.27-alpine

# Templated: the official nginx image runs envsubst over /etc/nginx/templates at
# start, so the CSP can name this deployment's Keycloak and piveau origins.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Only our variables, so nginx's own $uri, $host etc. survive envsubst.
ENV NGINX_ENVSUBST_FILTER=KEYCLOAK_ORIGIN|PIVEAU_ORIGINS|DOWNLOAD_API_ORIGIN|ANALYTICS_SCRIPT_ORIGINS|ANALYTICS_CONNECT_ORIGINS
# Scheme + host, no path. Overridden at run time; these match src/config.ts.
ENV KEYCLOAK_ORIGIN=https://auth.6gdali.eu
# Space-separated: hub-search and hub-repo.
ENV PIVEAU_ORIGINS="https://search.dataspace.6gdali.eu https://dataspace.6gdali.eu"
# The DataOps orchestrator, which signs download links (downloadApiUrl).
ENV DOWNLOAD_API_ORIGIN=https://dataops.6gdali.eu
# Google Analytics (used only when VITE_GA_MEASUREMENT_ID is set): where gtag.js loads from, and where it reports.
ENV ANALYTICS_SCRIPT_ORIGINS=https://www.googletagmanager.com
ENV ANALYTICS_CONNECT_ORIGINS="https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com"

# Renders config.js from VITE_* variables at start.
COPY docker-entrypoint.d/40-catalogue-config.sh /docker-entrypoint.d/40-catalogue-config.sh
RUN chmod +x /docker-entrypoint.d/40-catalogue-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

# 8080, as the previous image: the dataspace compose maps 18999:8080.
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
