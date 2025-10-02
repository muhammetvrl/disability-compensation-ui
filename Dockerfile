FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Copy production environment file as .env
COPY .env.production .env


ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

# Copy the standalone server and static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy package.json for dependencies
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:nodejs /app
USER nextjs

ENV NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

CMD ["node", "server.js"]

