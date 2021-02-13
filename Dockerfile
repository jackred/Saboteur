FROM node:latest
WORKDIR /usr/src/saboteur
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
CMD ["pm2-docker", "start", "process.json"]