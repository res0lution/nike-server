FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=src/infra/db/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
