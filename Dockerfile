# Stage 1: Build the Angular app
FROM node:16.16.0-alpine as build 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Create the production image
FROM nginx:alpine
COPY --from=build /app/dist/carpark-availability /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]