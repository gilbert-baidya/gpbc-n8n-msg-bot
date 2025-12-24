FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY src ./src

# Expose port (Railway will override with PORT env var)
EXPOSE 8080

# Set NODE_ENV
ENV NODE_ENV=production

# Run the application
CMD ["node", "src/server.js"]
