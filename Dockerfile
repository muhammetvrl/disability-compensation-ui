# Base image
FROM node:18-alpine AS builder

# Çalışma dizinini ayarla
WORKDIR /app

# Package manager olarak yarn kullanıyoruz
RUN corepack enable && corepack prepare yarn@stable --activate

# Package.json dosyalarını kopyala
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/*/package.json ./packages/

# Bağımlılıkları yükle
RUN yarn install --frozen-lockfile

# Kaynak kodları kopyala
COPY . .

# Production build
RUN yarn build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Package manager
RUN corepack enable && corepack prepare yarn@stable --activate

# Sadece gerekli dosyaları kopyala
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules

# Production modunda çalıştır
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"] 