# Use official Playwright Node.js base image 
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Define working directory
WORKDIR /app

# Copy package files with secure read-only permissions for root
COPY --chown=root:root --chmod=444 package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy config file securely
COPY --chown=root:root --chmod=444 playwright.config.ts ./

# Copy tests and utilities with read/exec-only permissions
COPY --chown=root:root --chmod=555 otaiE2ETests/ ./otaiE2ETests/

# Create and secure test-results and report directories with broad permissions to avoid write issues
RUN mkdir -p /app/test-results /app/playwright-report && \
    chmod -R 777 /app/test-results /app/playwright-report

# Switch to the non-root user for better security
USER pwuser

# Set default command to run tests
CMD ["npx", "playwright", "test"]