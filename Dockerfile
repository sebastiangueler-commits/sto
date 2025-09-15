# Use official Puppeteer image to simplify Chromium dependencies for PDF generation
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Install dependencies first
COPY package.json ./
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Expose port
ENV PORT=3000 NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
