# ui/VueApp.Dockerfile
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json ./
#COPY version.txt ./
#COPY entrypoint.sh ./

RUN npm install

# Copy over the UI source files
COPY . .

# Run unit tests and e2e tests
#RUN npm run unit
#RUN npm run e2e

# Build the UI
RUN npm run build production
#RUN cp ./version.txt ./dist/

FROM nginx as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
#COPY --from=build-stage /app/entrypoint.sh /entrypoint.sh
COPY version.txt /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]