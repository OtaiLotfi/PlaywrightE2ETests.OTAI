# Use official Playwright Node.js base image
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Define working directory
WORKDIR /app

# Copy package files with strict permissions
COPY --chown=root:root --chmod=444 package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy configuration file
COPY --chown=root:root --chmod=444 playwright.config.ts ./

# Copy tests and utilities
COPY --chown=root:root --chmod=555 otaiE2ETests/ ./otaiE2ETests/

# Ensure required directories for reports exist
RUN mkdir -p /app/test-results /app/playwright-report && \
    chown -R pwuser:pwuser /app/test-results /app/playwright-report && \
    chmod 755 /app/test-results /app/playwright-report

# Switch to secure non-root user provided by Playwright
USER pwuser

# Set default command to run tests
CMD ["npx", "playwright", "test"]