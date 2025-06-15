# Kinetic Rehabilitation Platform

An advanced physical therapy platform that uses smart movement analysis and pose estimation to help patients recover through guided exercises and real-time feedback.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 🚀 Features

- 🧍‍♂️ **Real-time Pose Detection** using MediaPipe/TensorFlow.js
- 📊 **Progress Tracking** with detailed analytics and improvement metrics
- 📹 **Video Calls** between patients and therapists using LiveKit
- 🔐 **Secure Authentication** with email/password and magic link options
- 📱 **Responsive Design** that works on mobile, tablet and desktop
- 🔄 **Real-time Updates** using Supabase Realtime
- 📆 **Appointment Scheduling** for therapy sessions
- 🧠 **Automated Feedback** on movement quality and suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS, Framer Motion
- **Backend**: Supabase, Node.js (Express for legacy support)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime + WebSockets
- **Video Calls**: LiveKit (WebRTC)
- **Pose Detection**: MediaPipe + TensorFlow.js
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (free tier works for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kinetic-ai.git
   cd kinetic-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Set up Supabase:
   - Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

5. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

- [Database Schema](./supabase-schema.sql)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Frontend-Backend Integration](./FRONTEND_BACKEND_INTEGRATION.md)
- [Advanced Features Guide](./README_ADVANCED_FEATURES.md)

## 🧩 Project Structure

```
/
├── app/                    # Next.js app router
│   ├── api/                # API routes
│   ├── dashboard/          # User dashboard
│   ├── auth/               # Auth-related pages
│   └── ...                 # Other app routes
├── components/             # React components
│   ├── ui/                 # UI components
│   ├── pose-estimation.tsx # Pose detection component
│   ├── video-call.tsx      # Video call component
│   └── ...                 # Other components
├── lib/                    # Utility functions and shared code
│   ├── supabase-client.ts  # Supabase client
│   └── ...                 # Other utilities
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── ...                     # Config files
```

## 🤝 Contributing

Contributions are welcome! Please check out our [contributing guidelines](./CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgements

- Pose detection powered by [MediaPipe](https://mediapipe.dev/) and [TensorFlow.js](https://www.tensorflow.org/js)
- Video calls powered by [LiveKit](https://livekit.io/)
- Backend and authentication powered by [Supabase](https://supabase.com/)