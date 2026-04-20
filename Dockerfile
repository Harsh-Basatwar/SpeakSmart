# Stage 1: Build React client
FROM node:18-alpine AS client-build

ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY server/package*.json ./server/
RUN cd server && npm ci --only=production
COPY server/ ./server/
COPY --from=client-build /app/client/build ./client/build

ENV NODE_ENV=production PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server/server.js"]
