FROM node:18-slim

# Install dependencies for Cypress
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    wget \
    unzip \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Expose the port that will be used by MCP clients
EXPOSE 3000

# Start the MCP server directly with HTTP transport
CMD ["node", "lib/cli-server.js", "http", "--headless"]
