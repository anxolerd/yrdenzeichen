FROM node:10.17.0 AS build-env
ADD ./app /app
WORKDIR /app
ENV NODE_ENV=production
RUN npm install --production

FROM gcr.io/distroless/nodejs
COPY --from=build-env /app /app
COPY LICENSE LICENSE
WORKDIR /app
EXPOSE 3000
CMD ["index.js"]
