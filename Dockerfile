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
RUN npm ci

# Copy only required files and folders with correct ownership
COPY --chown=pwuser:pwuser playwright.config.ts ./
COPY --chown=pwuser:pwuser otaiE2ETests/utils/ ./utils/
COPY --chown=pwuser:pwuser otaiE2ETests/tests/ ./tests/
COPY --chown=pwuser:pwuser otaiE2ETests/ ./otaiE2ETests/
# COPY --chown=pwuser:pwuser run-tests.sh ./  # Uncomment if needed

# Default command to run Playwright tests
CMD ["npx", "playwright", "test"]