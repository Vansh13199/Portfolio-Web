# syntax=docker/dockerfile:1
# ------------------------------------------------------------------
# Static portfolio served by nginx — tiny, cacheable, production-ready.
# Build:  docker build -t portfolio .
# Run:    docker run --rm -p 8080:80 portfolio   ->  http://localhost:8080
# ------------------------------------------------------------------
FROM nginx:1.27-alpine

# Drop the default site and add our hardened config
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static assets
COPY index.html styles.css script.js /usr/share/nginx/html/

# Non-root for good measure
EXPOSE 80

# Simple container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
