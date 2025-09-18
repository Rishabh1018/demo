# Nirvaan - Set Your Mind Free

A Digital Psychological Intervention System for college students to address mental health issues through a comprehensive web platform.

## Features

- 🤖 **Sukoon AI Chat** - AI-guided first-aid support with crisis detection
- 📅 **Confidential Booking** - Schedule counselor appointments privately  
- 📚 **Resource Hub** - Psychoeducational resources with multilingual content
- 👥 **Peer Support** - Moderated community forums
- 📊 **Admin Dashboard** - Anonymous analytics for institutional monitoring
- 🧘 **Wellness Journey** - Daily check-ins and progress tracking
- 🫁 **Breathing Exercises** - Guided mindfulness and breathing techniques

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nirvaan-mental-health-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion (formerly Framer Motion)

## Project Structure

```
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── figma/          # Figma-specific components
├── styles/             # Global CSS and Tailwind config
├── utils/              # Utility functions and API
├── supabase/           # Supabase Edge Functions
└── guidelines/         # Development guidelines
```

## Support

For support and crisis resources:
- **Campus Counseling**: (555) 123-HELP
- **Crisis Hotline**: 988 - Suicide & Crisis Lifeline  
- **Emergency**: 911 or Campus Security

---

*Nirvaan - Your safe space for mental wellness support.*