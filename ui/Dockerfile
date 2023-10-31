# ui/VueApp.Dockerfile
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy over the UI source files
COPY . .

# Run unit tests and e2e tests
#RUN npm run unit
#RUN npm run e2e

# Build the UI
RUN npm run build production

FROM nginx as production-stage

# Install gettext for envsubst to replace config variables easily
RUN apt-get update && apt-get install -y gettext

# Copy the app files, including index.html
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the version.txt, nginx conf file, and the entrypoint.sh script
COPY version.txt /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]