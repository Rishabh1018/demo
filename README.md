# Digital-Mental-Health-and-Psychological-Support-System

A confidential digital platform for students to access mental health support. Track moods, explore self help resources, and connect with counselors securely and stigma free. Designed to be accessible, inclusive, and mobile-friendly for students across all higher education institutions.
---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Objective](#objective)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Register and log in with email and password. JWT-based authentication.
- **AI Chatbot**: Anonymous AI Chatbot for real-time mood tracking and conversation..
- **Counselor Dashboard**: role-based access for trained professionals.
- **Crisis Detection & Escalation**: Alerts when severe stress/depression signals are detected → connect to counselor helpline.
- **Self-Help Library**: breathing exercises, sleep hygiene, exam-stress tips, mindfulness tracks.
- **Admin Panel**: Approve, reject, or remove items. Admin-only access.
- **Mood Journal & Analytics**: Students can track daily mood patterns.
- **Responsive UI**: Modern, mobile-friendly design using Tailwind CSS and Radix UI components.
  


---

## Tech Stack
- **Frontend**: [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/API**: Next.js API routes
- **Database**: Supabase
- **Authentication**: JWT (JSON Web Tokens)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn, but pnpm is recommended)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Digital-Mental-Health-and-Psychological-Support-System

   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (see [Environment Variables](#environment-variables)).
4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
pnpm build
pnpm start
```

---

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_supabase_url
JWT_SECRET=your_jwt_secret

```

- `DATABASE_URL`: Supabase connection string
- `JWT_SECRET`: Secret key for JWT authentication


---

## Objectives

-Build an accessible digital platform for students to seek mental health support without stigma.
-Provide AI-based mood analysis & early detection through conversational interaction.
-Integrate self-help resources: guided meditation, stress-relief exercises, academic stress management.
-Enable secure student–counselor interactions (chat/video).
-Maintain privacy & anonymity to ensure safe usage.
-Collect non-identifiable analytics for institutions to design better interventions.
---

## Folder Structure
```


digital-mental-health-support/
│── index.html        # Main entry
│── css/
│    └── style.css    # Styles
│── js/
│    └── main.js      # Core logic
│── assets/           # Icons, vectors, images
│── README.md         # Project overview (this file)
│── libs/             # Any supporting libraries (if required)
├── package.json        # Project metadata and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── pnpm-lock.yaml      # pnpm lockfile
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

