# Customer Support Backend API

A customer support backend API built with Bun, Hono, and Mastra for AI-powered customer service.

## Requirements

Before running the backend, ensure you have the following installed:

- **Bun Runtime** - The application requires Bun runtime to be installed on your system
  - Installation: https://bun.sh/docs/installation
- **Redis** - Redis server must be running for rate limiting and caching
  - Installation: https://redis.io/docs/getting-started/
  - Default connection: `redis://localhost:6379`

## Installation

```sh
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required

- `GOOGLE_GENERATIVE_AI_API_KEY` - API key for Google Gemini model used by the customer support agent

### Optional (for deployment)

- `TURSO_DB_URL` - Turso database URL (for production deployment)
- `TURSO_DB_TOKEN` - Turso database authentication token (for production deployment)
- `REDIS_URL` - Redis connection URL (defaults to `redis://localhost:6379`)

## Database Setup

### Development

For local development, the application automatically creates a local LibSQL database file (`agent-memory.db`) in the project root. No additional setup is required.

### Production/Deployment

For deployment, the application uses Turso. Set the `TURSO_DB_URL` and `TURSO_DB_TOKEN` environment variables to connect to your Turso database instance.

## Running the Application

1. Ensure Redis server is running:
   ```sh
   redis-server
   ```

2. Start the development server:
   ```sh
   bun run dev
   ```

The server will start on `http://localhost:3000`

## File Structure

```
src/
├── server.ts                    # Main server entry point
├── modules/                     # Feature modules
│   ├── index.ts                 # Module router
│   ├── users/                   # User management module
│   │   ├── cache.ts            # Redis-based user cache
│   │   ├── index.ts            # Module exports
│   │   ├── routes.ts           # User API routes
│   │   ├── service.ts          # User business logic
│   │   ├── types.ts            # TypeScript types
│   │   └── validators.ts       # Request validators
│   └── customer-support/        # Customer support module
│       ├── agent-memory.ts     # Mastra memory configuration
│       ├── agents.ts           # AI agent configuration
│       ├── index.ts            # Module exports
│       ├── middleware.ts       # Authentication middleware
│       ├── routes.ts           # Customer support API routes
│       ├── services.ts         # Business logic for threads/messages
│       ├── types.ts            # TypeScript types
│       └── validators.ts       # Request validators
└── shared/                      # Shared utilities
    ├── middleware/
    │   └── rate-limiter.ts     # IP-based rate limiting middleware
    ├── types.ts                # Shared TypeScript types
    └── utils/
        └── error-response.ts   # Error response handler
```

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:userId` - Get user by ID

### Customer Support (requires authentication)

All customer support endpoints require an `Authorization` header with the user ID.

- `POST /api/threads` - Create a new support thread
- `GET /api/threads` - List all threads for the authenticated user
- `GET /api/threads/:threadId` - Get a specific thread
- `PUT /api/threads/:threadId` - Update a thread
- `DELETE /api/threads/:threadId` - Delete a thread
- `GET /api/threads/:threadId/messages` - List messages in a thread
- `POST /api/threads/:threadId/messages` - Send a message and get AI agent response

## Features

- **AI-Powered Customer Support**: Uses Google Gemini model for intelligent customer service responses
- **Thread Management**: Full CRUD operations for support threads
- **Message History**: Persistent message storage with Mastra memory
- **Authentication**: User-based authentication middleware
- **Rate Limiting**: IP-based sliding window rate limiting using Redis
- **Access Control**: Thread ownership validation to prevent unauthorized access

## Dependencies

- **Bun** - Runtime and package manager
- **Hono** - Web framework
- **Mastra** - AI agent framework
- **LibSQL** - SQLite-compatible database
- **Turso** - Distributed SQL database (for production)
- **Redis** - Rate limiting and caching
- **Zod** - Schema validation
