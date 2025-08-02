# Use the official Node.js 18 image
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your project files
COPY . .

# Run Playwright dependencies (already handled by base image)
# Optional: npx playwright install --with-deps

# Run tests (optional if you're only building the image)
CMD ["npx", "playwright", "test"]
