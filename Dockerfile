# Stage 1: Build the Next.js application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production container
FROM node:20-alpine AS production

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start the Next.js application
CMD ["npm", "start"]
