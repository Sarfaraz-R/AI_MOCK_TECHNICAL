# Scribo

Scribo is a Next.js interview preparation app for practicing AI mock interviews, timed MCQ assessments, and subject-wise revision decks. It combines Gemini-powered interview generation and feedback with Neon/PostgreSQL storage, Drizzle ORM, and a custom JWT-based auth flow.

## What the app does

- Create AI mock interviews from a role, stack, and experience level
- Run a live interview flow with webcam/mic checks and recorded responses
- Generate answer-level AI feedback and overall interview summaries
- Practice timed MCQ assessments with instant scoring and review
- Revise subjects through a Top 50 flashcard-style deck
- Generate and store custom question banks
- Track previous mock interviews and recent MCQ results from the dashboard
- Send contact/support emails through the built-in API route

## Tech stack

- Next.js 14
- React 18
- Tailwind CSS
- Drizzle ORM
- Neon Serverless PostgreSQL
- Google Gemini API
- Radix UI primitives
- Framer Motion
- Lucide icons

## Main app areas

- `/`
  Landing page and product overview

- `/sign-in`, `/sign-up`
  Email/password auth screens

- `/dashboard`
  Main workspace with:
  - Start mock interview
  - Quick revise / MCQ assessment
  - Subject Top 50 revision
  - Previous mock interviews
  - Quick MCQ result history

- `/dashboard/interview/[interviewId]`
  Interview briefing and device setup

- `/dashboard/interview/[interviewId]/start`
  Live interview question flow and response recording

- `/dashboard/interview/[interviewId]/feedback`
  Post-interview feedback and scoring

- `/dashboard/assessment`
  Timed MCQ assessment module

- `/dashboard/revise`
  Subject revision hub

- `/dashboard/revise/[subjectSlug]`
  Flashcard-style Top 50 revision deck

- `/dashboard/question`
  Question bank creation and history

- `/dashboard/pyq/[pyqId]`
  Generated question set detail page

- `/dashboard/upgrade`
  Pricing / upgrade screen

- `/dashboard/howit`
  Product workflow / how-it-works page

## Data model

The app currently uses these main tables in [`utils/schema.js`](./utils/schema.js):

- `app_user`
  Stores users for email/password auth

- `mockInterview`
  Stores generated interviews and interview metadata

- `question`
  Stores generated question banks

- `userAnswer`
  Stores per-question interview answers, ratings, and feedback

- `newsletter`
  Stores contact form / message submissions

MCQ assessment result history is currently stored in local storage for the signed-in user, not in the database.

## Authentication

This project uses a custom auth flow, not Clerk runtime auth, even though Clerk packages are installed.

Current auth setup includes:

- Email/password sign up and sign in
- JWT session cookies
- Google OAuth helper/config support
- `/api/auth/me`, `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`
- Google auth routes under `/api/auth/google/*`

Relevant files:

- [`components/AuthProvider.jsx`](./components/AuthProvider.jsx)
- [`lib/auth.js`](./lib/auth.js)
- [`lib/auth-jwt.js`](./lib/auth-jwt.js)
- [`lib/google-auth.js`](./lib/google-auth.js)

## Environment variables

Create a `.env.local` file with the values your setup needs.

Required for core app flow:

```env
NEXT_PUBLIC_DRIZZLE_DB_URL=
NEXT_PUBLIC_GEMINI_API_KEY=
JWT_SECRET=
```

Optional but supported:

```env
NEXT_PUBLIC_GEMINI_MODEL=gemini-3.5-flash
NEXT_PUBLIC_GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
JWT_EXPIRES_IN_DAYS=7

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

EMAIL_USER=
EMAIL_PASS=

NEXT_PUBLIC_INFORMATION=
NEXT_PUBLIC_QUESTION_NOTE=
```

Notes:

- `NEXT_PUBLIC_DRIZZLE_DB_URL` is used by both Drizzle config and runtime DB access in this codebase.
- `JWT_SECRET` should be replaced with a real secret outside local experimentation.
- `EMAIL_USER` and `EMAIL_PASS` are used by `/api/send-email`.

## Getting started

1. Clone the repository

```bash
git clone <your-repo-url>
cd AI_MOCK_TECHNICAL
```

2. Install dependencies

```bash
npm install
```

3. Add your environment variables in `.env.local`

4. Push the database schema

```bash
npm run db:push
```

5. Start the development server

```bash
npm run dev
```

6. Open the app

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
npm run db:studio
```

## Project structure

```text
app/
  api/
  dashboard/
    assessment/
    interview/
    question/
    revise/
    upgrade/
  (auth)/
components/
lib/
utils/
```

## Current feature notes

- Interview questions and feedback are generated through Gemini.
- The interview flow stores answer transcripts, feedback, and ratings in the database.
- MCQ assessments are scored instantly in the client and include answer review.
- Subject revision decks are generated from the internal question bank and presented as flashcards.
- Some marketing copy on the landing page mentions future-facing features that are not fully implemented yet, such as deeper analytics, resume analysis, and coding assessment workflows.

## Build / dev note

If Next.js throws missing generated chunk errors such as files inside `.next/server/...`, clear the build output and restart the dev server:

```bash
rm -rf .next
npm run dev
```

## License

Add your preferred license here if you plan to distribute the project publicly.
