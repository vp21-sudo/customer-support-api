# Build stage
FROM oven/bun:1.3.5-debian AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy rest of the files
COPY . ./

# Final stage - use bun image to run (native deps included)
FROM oven/bun:1.3.5-debian

WORKDIR /app

# Copy node_modules and source files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

# EXPOSE the port your backend listens on
EXPOSE 4000

# Run with bun (don't compile - native deps need runtime)
CMD ["bun", "run", "src/server.ts"]