# ── Frontend Dockerfile (Next.js standalone) ─────────────────────────────────

# Stage 1 — Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
# Copy workspace config if it exists
COPY pnpm-workspace.yaml* ./
RUN pnpm install --no-frozen-lockfile

# Stage 2 — Build the application
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (non-secret, baked into JS bundle)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# Stage 3 — Production runner (uses Next.js standalone output)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy what the standalone output needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT=3000
# Bind to all interfaces so Docker port mapping works
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
