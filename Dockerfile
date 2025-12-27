# Build stage
FROM oven/bun:1.3.5-debian AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy rest of the files
COPY . ./

# Build the binary
RUN bun build src/server.ts --compile --outfile server

# Final stage
FROM debian:bookworm-slim

WORKDIR /app

# Copy only the compiled binary
COPY --from=builder /app/server ./server

# EXPOSE the port your backend listens on
EXPOSE 4000

# Run the binary
CMD ["./server"]