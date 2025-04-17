FROM node:alpine
#RUN apt-get update && apt-get install -y procps
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

EXPOSE 3001