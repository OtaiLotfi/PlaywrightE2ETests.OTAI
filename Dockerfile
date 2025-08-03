# Use the official Playwright Node.js 18 image
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# Set working directory and ensure correct permissions
WORKDIR /app

# Copy package files with root ownership and restrictive permissions
COPY --chown=root:root --chmod=444 package.json ./package.json
COPY --chown=root:root --chmod=444 package-lock.json ./package-lock.json

# Install dependencies (still as root)
RUN npm ci

# Copy configuration file with root ownership and read-only permission
COPY --chown=root:root --chmod=444 playwright.config.ts ./playwright.config.ts

# Copy test-related directories with root ownership and read-only permissions
COPY --chown=root:root --chmod=555 otaiE2ETests/utils/ ./utils/
COPY --chown=root:root --chmod=555 otaiE2ETests/tests/ ./tests/
COPY --chown=root:root --chmod=555 otaiE2ETests/ ./otaiE2ETests/

# (Optional) Include and permission script
# COPY --chown=root:root --chmod=555 run-tests.sh ./run-tests.sh

# Switch to the non-root user provided by Playwright for execution
USER pwuser

# Default command to run Playwright tests
CMD ["npx", "playwright", "test"]