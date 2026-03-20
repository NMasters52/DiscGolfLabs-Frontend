# Masters Disc Golf - Frontend

A modern, data-driven disc golf training platform designed to help players improve their putting skills through structured practice, real-time feedback, and progress tracking.

## 🎯 Project Overview

**Masters Disc Golf** is a web application that provides disc golf players with a scientific approach to putting improvement. The platform features interactive training games, comprehensive performance analytics, and a structured course system that adapts to player progress.

**Key Value Proposition:** Stop guessing. Start improving. Our feedback-driven system diagnoses mechanical flaws, quantifies progress, and helps build a self-correcting game through:
- Root-cause analysis of putting form
- Data feedback through interactive games
- Pressure practice simulators
- Adaptive training that evolves with player stats

## 🛠️ Tech Stack

### Core Framework
- **React Router v7** (7.12.0) - Client-side routing framework with file-based routing and data loading
- **React 19** (19.2.3) - Latest React features with improved performance and developer experience
- **TypeScript** (5.9.2) - Type-safe development with enhanced maintainability

### Styling & UI
- **Tailwind CSS v4** (4.1.13) - Modern utility-first CSS framework
- **shadcn/ui** - Reusable, accessible UI components built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Framer Motion** (12.35.0) - Production-grade motion library for smooth animations
- **next-themes** (0.4.6) - Dark/light mode theming with system preference detection
- **lucide-react** (0.574.0) - Beautiful, consistent icon library

### Data & State Management
- **TanStack Query v5** (5.90.19) - Powerful server state management with caching, synchronization, and background updates
- **React Router loaders/actions** - Built-in data fetching and mutation patterns

### Authentication
- **Clerk** - Production-ready authentication solution with React Router integration and theming support

### Development Tools
- **Vite** (7.1.7) - Fast build tool with HMR
- **TypeScript** - Full type coverage across the codebase
- **ESLint** - Code quality and consistency

### Data Visualization
- **Recharts** (2.15.4) - Composable charting library for analytics dashboards
- **Embla Carousel** (8.6.0) - Accessible carousel component for UI elements

## 📁 Project Structure

```
app/
├── api/                    # API route handlers (server-side)
│   ├── course.js
│   ├── enrollment.js
│   ├── games.js
│   └── user.js
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── cards/          # Data visualization cards
│   │   ├── MobileDashboard.tsx
│   │   └── DesktopDashboard.tsx
│   ├── games/              # Interactive training games
│   │   ├── PuttingLadderGame.jsx
│   │   └── PuttingProgressView.jsx
│   ├── landing/            # Marketing/landing page components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── stats.tsx
│   │   └── session-logs.tsx
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── game/                   # Game logic and state management
│   └── puttingLadder/
│       ├── usePuttingLadderGame.js
│       └── state.js
├── hooks/                  # Custom React hooks
│   └── use-mobile.ts
├── lib/                    # Utility functions
│   └── utils.ts
├── queries/                # React Query hooks for data fetching
│   ├── useCourses.js
│   ├── useGameSession.js
│   ├── usePuttingGameStats.js
│   └── useEnrollment.js
├── routes/                 # File-based routing
│   ├── _landing/           # Public landing pages
│   ├── app/                # Authenticated app routes
│   │   └── dashboard/      # Dashboard implementation
│   ├── courses/            # Course learning pages
│   └── checkout/           # Payment flows
└── root.tsx                # Root layout with providers
```

## 🚀 Key Features

### 1. Interactive Training Games
- **Putting Ladder Game**: Progressive putting practice that increases distance based on performance
- **Real-time feedback**: Instant scoring and progress tracking
- **State management**: Custom hooks for game logic (`usePuttingLadderGame`)
- **Session tracking**: Automatic save and resume functionality

### 2. Analytics Dashboard
- **Multi-device responsive design**: Separate layouts for mobile and desktop
- **Performance metrics**: Make rate, distance zones, focus insights
- **Session history**: Track recent practice sessions with detailed stats
- **Progress visualization**: Charts and progress bars using Recharts
- **Course tracking**: Day-by-day progress through training courses

### 3. Course Management System
- **Enrollment tracking**: Monitor progress through multi-day courses
- **Day-by-day learning**: Structured content delivery
- **Completion tracking**: Visual indicators of course progress
- **Course completion flow**: Special layout when courses are finished

### 4. Authentication & User Management
- **Clerk integration**: Secure authentication with social providers
- **Protected routes**: Route-level auth guards (`require-auth.jsx`)
- **User profile management**: Query user data with React Query

### 5. Marketing & Onboarding
- **Landing pages**: Hero, features, testimonials, FAQ, pricing
- **Waitlist system**: Email capture for product launch
- **Course showcase**: Detailed course information pages
- **Dark/light mode**: System-aware theming with user control

## 🎨 Design System

### Color Palette
- **Primary**: Metallic Blue (`#22577A`) and Teal (`#38A3A5`)
- **Accents**: Cyan (`#6DEAF9`) for highlights and interactions
- **Neutral Gradients**: Sophisticated background effects
- **Dark Mode**: Full support with seamless theme transitions

### UI Patterns
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Subtle Gradients**: Background effects for depth
- **Grid Overlays**: Technical, geometric aesthetic
- **Motion Design**: Smooth transitions using Framer Motion

### Typography
- **Inter**: Primary typeface (Google Fonts)
- **Monospace**: Technical labels and data points
- **Responsive scaling**: Optimized for all screen sizes

## 🔄 State Management Architecture

### Client State
- **React Query**: Server state with caching, refetching, and optimistic updates
- **Custom Hooks**: Encapsulated game logic (`usePuttingLadderGame`)
- **Local State**: Component-level state with React hooks

### Server State
- **React Router Loaders**: Data fetching for route transitions
- **React Router Actions**: Form submissions and mutations
- **API Routes**: Server-side endpoints for data operations

### Game State
- **Immutable Updates**: Functional state management in game logic
- **State Machines**: Clear state transitions (playing → completed)
- **Payload Building**: Structured data for session persistence

## 📊 Codebase Statistics

- **Total Lines of Code**: ~6,700+ lines
- **TypeScript Coverage**: 100% for new components
- **Routes**: 12+ route configurations
- **Components**: 30+ reusable components
- **Custom Hooks**: 5+ specialized hooks
- **API Endpoints**: 5+ server routes

## 🎯 Development Practices

### Code Organization
- **Feature-based structure**: Components grouped by domain
- **Separation of concerns**: UI, logic, and data layers separated
- **Custom hooks pattern**: Reusable logic extraction
- **Type safety**: Full TypeScript coverage where applicable

### Performance
- **Client-side routing**: Fast navigation with React Router
- **Code splitting**: Route-based code splitting with React Router
- **Optimistic updates**: Instant UI feedback with React Query
- **Lazy loading**: Components loaded on demand

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA attributes**: Screen reader support where needed
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Proper focus handling in modals and forms

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Type checking
npm run typecheck
```
