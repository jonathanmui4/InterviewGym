# Interview Gym 💪
The place to get reps and sets in to prepare for your next tech interview. 

---

## 📖 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Set Up Development Environment](#set-up-development-environment)
- [Getting Started](#getting-started)
- [Credits](#credits)

## 🔨 Tech Stack
- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn](https://shadcn.dev)
- **Authentication & storage**: [Firebase](https://firebase.google.com/)
- **Voice Assistant**: [Vapi AI](https://vapi.ai/)
- **AI Assistant**: [Google Gemini](https://gemini.google.com/)
- **Deployment**: [Vercel](https://vercel.com)

## 🤩 Features
- **Authentication**: Sign up and sign in using the traditional email and password, your Google account or Github account.
- **Create Interviews**: Easily generate job interviews to practice on with Vapi voice assistant and Google Gemini
- **Get feedback from AI**: Take the interview with the AI voice agent and receive instant feedback!
- **Interview Page**: Conduct interviews with real-time feedback and detailed transcripts, almost as if you're on Microsoft teams. 
- **Dashboard**: Manage and track your interviews and interviews created by other users.

## Set Up Development Environment
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Create firebase project
- Setup Authentication and firestore database
- Download admin sdk private keys

### Create Vapi Assistant
- Setup Assistant and workflow (for interview generation)
- Current workflow:
    - Hello, {{ username }}! Let's prepare your interview. I'll ask you a few questions and generate a perfect interview just for you. Are you ready?
    - Collect role, type (technical or behavioural), level, amount (as in no of questions), techstack
    - Make post request with collected data 
    - Say interview has been generated and thank user for call.

## Getting Started

First, install packages (ensure running on node v22.14):
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Credits
JS Mastery's online tutorial [here](https://www.youtube.com/watch?v=8GK8R77Bd7g)
