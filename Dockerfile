FROM node:18-alpine 

RUN mkdir -p /usr/src/index

WORKDIR /usr/src/index

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3070
CMD [ "npm", "start" ]