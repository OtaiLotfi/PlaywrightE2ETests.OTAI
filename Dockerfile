# Use the official Playwright Node.js 18 image
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Set working directory and ensure correct permissions
WORKDIR /app
RUN mkdir -p /app && chown -R pwuser:pwuser /app

# Switch to the non-root user provided by Playwright
USER pwuser

# Copy package files and install dependencies
COPY --chown=pwuser:pwuser package.json ./
COPY --chown=pwuser:pwuser package-lock.json ./
RUN chmod 444 package.json package-lock.json && npm ci

# Copy configuration file
COPY --chown=pwuser:pwuser playwright.config.ts ./
RUN chmod 444 playwright.config.ts

# Copy test-related directories and make them read-only
COPY --chown=pwuser:pwuser otaiE2ETests/utils/ ./utils/
COPY --chown=pwuser:pwuser otaiE2ETests/tests/ ./tests/
COPY --chown=pwuser:pwuser otaiE2ETests/ ./otaiE2ETests/

# Remove write permissions from all copied directories recursively
RUN chmod -R a-w ./utils ./tests ./otaiE2ETests

# Uncomment if needed
# COPY --chown=pwuser:pwuser run-tests.sh ./
# RUN chmod 555 run-tests.sh

# Default command to run Playwright tests
CMD ["npx", "playwright", "test"]