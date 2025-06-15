# Kinetic AI - Setup Instructions

This document provides detailed instructions for setting up and running the Kinetic AI application.

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (free tier works for development)
- Git (for version control)

## Setting Up the Project

### 1. Install Dependencies

First, install all the required dependencies:

```bash
# Using npm
npm install

# Using pnpm
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory based on the `.env.local.example` file:

```
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Legacy backend (if still in use)
BACKEND_URL=http://localhost:8000

# LiveKit credentials (for video calls)
NEXT_PUBLIC_LIVEKIT_URL=your-livekit-url
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret

# Email service (for notifications)
EMAIL_SERVICE_API_KEY=your-email-service-api-key
EMAIL_FROM=no-reply@yourdomain.com
```

Replace the placeholder values with your actual credentials.

### 3. Set Up Supabase

1. Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to set up your Supabase project.
2. Execute the SQL script in [supabase-schema.sql](./supabase-schema.sql) to create all required tables and security policies.

### 4. Running the Application

#### Development Mode

To run the application in development mode:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

#### Production Build

To build and run the application for production:

```bash
# Using npm
npm run build
npm start

# Using pnpm
pnpm build
pnpm start
```

### 5. Testing the Integration

For testing with the FastAPI backend (optional):

```bash
# Start both frontend and backend
npm run integration

# Start only the backend
npm run backend
```

## Application Structure

- `/app` - Next.js app router and pages
- `/components` - React components
- `/lib` - Utility functions and shared code
- `/hooks` - Custom React hooks
- `/public` - Static assets

## Authentication

The application uses Supabase Auth for authentication. You can:

1. Register a new account
2. Log in with email/password
3. Use magic link authentication
4. Reset password

For demo purposes, you can use the Quick Login buttons on the login page.

## Working with the API

The application uses the `useAuthApi` hook for making authenticated API requests. This hook handles:

1. Authentication token management
2. Error handling
3. Toast notifications
4. Real-time updates using Supabase Realtime

## Pushing to GitHub

To push your code to GitHub, run the PowerShell script:

```powershell
./push-to-github.ps1
```

Follow the prompts to:
1. Enter your GitHub username
2. Specify a repository name
3. Provide a commit message

## Troubleshooting

- **Authentication Issues**: Check that your Supabase URL and anon key are correctly set in `.env.local`
- **Database Errors**: Verify that you've executed all the SQL in the schema file
- **Missing Assets**: Make sure all required assets are in the `/public` directory
- **API Errors**: Check that the API routes are correctly configured and the backend is running (if needed)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [LiveKit Documentation](https://docs.livekit.io/)