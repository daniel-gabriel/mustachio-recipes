# ui/VueApp.Dockerfile
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json ./
COPY version.txt ./

RUN npm install

# Copy over the UI source files
COPY . .

# Run unit tests and e2e tests
#RUN npm run unit
#RUN npm run e2e

# Build the UI
RUN npm run build production
RUN cp ./version.txt ./dist/

FROM nginx as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
