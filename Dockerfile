FROM node:17-alpine
WORKDIR /app/
COPY package*.json ./
COPY prisma ./prisma
RUN yarn install
COPY . .
ENV NODE_ENV=development


EXPOSE 5000
CMD ["yarn","start:dev"]