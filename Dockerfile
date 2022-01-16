FROM node:17-alpine AS builder
WORKDIR /app/
COPY package*.json .
COPY /prisma ./prisma
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

FROM node:17-alpine 
WORKDIR /app/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 8080

CMD ["yarn", "start:prod"]