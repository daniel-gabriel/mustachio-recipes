# api/NodeAPI.Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY version.txt ./

RUN npm install

# Copy over the API source files
COPY . .

# Run unit tests and e2e tests
#RUN npm run unit
#RUN npm run e2e

# Build the API
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
