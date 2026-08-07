# ==============================================================================
# Omni Agent — frontend (Next.js 15) production image (multi-stage)
# ==============================================================================

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# No committed package-lock.json yet (generate one with `npm install` locally
# and switch this to `npm ci` for reproducible builds once you have it).
# --legacy-peer-deps as a safety net for the React 19 / Radix / R3F dependency
# tree, which wasn't resolved against a live npm registry before this build.
RUN npm install --legacy-peer-deps

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so
# they must be passed as build args (not just container env) to actually
# take effect — plain `environment:` on the frontend service in
# docker-compose.yml only affects the server-side runtime, not this build.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8000/api/v1/ws
ARG NEXT_PUBLIC_APP_NAME="Omni Agent"
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 omni

COPY --from=builder /app/public ./public
COPY --from=builder --chown=omni:nodejs /app/.next/standalone ./
COPY --from=builder --chown=omni:nodejs /app/.next/static ./.next/static

USER omni
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
