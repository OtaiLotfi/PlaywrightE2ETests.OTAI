# Use the official Playwright Node.js 18 image
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy only required files and folders
COPY playwright.config.ts ./
COPY utils/ ./utils/
COPY tests/ ./tests/
COPY run-tests.sh ./  # Only if you use this script to run tests

# Set default command to run Playwright tests
CMD ["npx", "playwright", "test"]