FROM node:10.17.0 AS build-env

WORKDIR /app
ENV NODE_ENV=production

COPY ./app/package*.json .
RUN npm ci
COPY ./app/*.js .
COPY ./app/validators .


FROM gcr.io/distroless/nodejs
COPY --from=build-env /app /app
COPY LICENSE LICENSE
WORKDIR /app
EXPOSE 3000
CMD ["index.js"]
