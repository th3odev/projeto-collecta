FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG BASE_PATH=/react1/
RUN npm run build -- --base $BASE_PATH

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/react1/