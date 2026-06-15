# ── Stage 1: install dependencies ───────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack@latest && corepack prepare pnpm@10 --activate && corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile

# ── Stage 2: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack@latest && corepack prepare pnpm@10 --activate && corepack enable
COPY --from=deps /pnpm /pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=8192
RUN pnpm build

# ── Stage 3: serve ──────────────────────────────────────────────────────────
FROM nginx:alpine

EXPOSE 8080

COPY --from=builder /app/dist /usr/share/nginx/html/
COPY nginx/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
COPY config/default.env /default.env
COPY runtimeconfig.sh /

# OpenShift compatibility — allow running as arbitrary user in root group
RUN mkdir -p /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/scgi_temp && \
    chmod g+rwx /var/cache/nginx \
                /var/run \
                /var/log/nginx \
                /var/cache/nginx/client_temp

RUN apk add --no-cache gettext dos2unix && \
    dos2unix /runtimeconfig.sh && \
    dos2unix /default.env && \
    chmod +x /runtimeconfig.sh && \
    chmod a+rw /usr/share/nginx/html/ && \
    chmod a+rw /usr/share/nginx/html/assets && \
    chmod a+rw /usr/share/nginx/html/assets/*

CMD ["/runtimeconfig.sh"]
