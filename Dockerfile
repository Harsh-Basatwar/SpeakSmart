# Stage 1: Build React client
FROM node:18-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source
COPY server/ ./server/

# Copy database files
COPY database/ ./database/

# Copy React build into a location the server can serve statically
COPY --from=client-build /app/client/build ./client/build

# Environment defaults (override at runtime)
ENV NODE_ENV=production \
    PORT=5000 \
    CLIENT_URL=http://localhost:5000

EXPOSE 5000

CMD ["node", "server/server.js"]
