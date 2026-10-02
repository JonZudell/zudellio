# zudell.io — THE SITE AS IT IS, not as it was rewritten.
#
# `web/` is a Next.js rewrite of this app. It is close but not identical: the
# homepage drops the post widgets and images, the type is larger, the links are
# styled differently. Rather than chase parity, this builds the ORIGINAL and serves
# its static output, which is identical by construction because it IS the thing.
#
# The build is a static-site generator (ssgwp.js, the webpack plugin the
# `static_site_generation` post describes) that emits a directory of plain HTML:
# index.html, contact/, auth/sign_in/, auth/sign_up/ and one directory per post. No
# server is needed to render any of it.

FROM node:20-alpine AS builder
WORKDIR /app
# .npmrc IS NOT OPTIONAL HERE. It carries `legacy-peer-deps=true`, and these 60
# dependencies do not resolve without it -- `npm ci` exits 1 on a peer conflict with
# no useful message once buildkit has collapsed the log. Copying only the two
# manifests looks tidy and silently changes how npm resolves.
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# THE UNPRIVILEGED IMAGE, because the chart sets runAsNonRoot and names a numeric
# uid. Stock nginx wants root to bind 80 and to write its pidfile; this one is built
# to run as uid 101 and listens on 8080, so nothing needs relaxing on the pod.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# `try_files $uri $uri/ $uri/index.html` is the whole of dist/rewrites.json: every
# route the generator emits is a directory with an index.html in it, so clean URLs
# resolve without a rewrite table. (rewrites.json itself is built on Windows and has
# backslashes in its paths, which would not match anything here anyway.)
#
# /api/health exists so this app answers the same probe path as every other tenant on
# the chart. A static site has no health to report beyond "nginx is up", which is
# exactly what the probe is asking.
COPY <<'CONF' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location = /api/health {
        add_header Content-Type application/json;
        return 200 '{"status":"healthy"}';
    }

    location / {
        # $uri/index.html BEFORE $uri/, and the order is the whole point. With
        # `$uri/` first nginx redirects /contact to /contact/ with a 301 and the
        # address bar grows a trailing slash; live serves /contact as 200 directly.
        # Resolving to the index file first keeps the URLs identical to live's.
        try_files $uri $uri/index.html $uri/ =404;
    }

    # Content-hashed assets, so they can be cached hard. The HTML cannot: it names
    # the current hashes and has to be re-read for a deploy to be visible.
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }
}
CONF

EXPOSE 8080
