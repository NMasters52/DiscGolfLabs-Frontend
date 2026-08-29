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
- **Motion** (12.35.0) - Production-grade motion library for smooth animations
- **next-themes** (0.4.6) - Dark/light mode theming with system preference detection
- **lucide-react** (0.574.0) - Beautiful, consistent icon library
- **Embla Carousel** (8.6.0) - Accessible carousel component for UI elements

### Data & State Management

- **TanStack Query v5** (5.90.19) - Powerful server state management with caching, synchronization, and background updates
- **React Router loaders/actions** - Built-in data fetching and mutation patterns

### Authentication

- **Clerk** - Production-ready authentication solution with React Router integration and theming support

### Development Tools

- **Vite** (7.1.7) - Fast build tool with HMR
- **TypeScript** - Full type coverage across the codebase

## Project Structure

The `app/` directory is organized by concern: route handlers in `api/`, domain-grouped components in `components/`, game logic in `game/`, data-fetching hooks in `queries/`, and file-based routing under `routes/`. See [docs/architecture.md](docs/architecture.md) for the full structure.

## 🚀 Key Features

### 1. Interactive Training Games

- **Putting Ladder Game**: Progressive putting practice that increases distance based on performance
- **Real-time feedback**: Instant scoring and progress tracking
- **State management**: Custom hooks for game logic (`usePuttingLadderGame`)
- **Session tracking**: Automatic save and resume functionality

### 2. Analytics Dashboard

- **One responsive composition**: A single Command Center layout that adapts from mobile to desktop
- **Performance metrics**: Make rate overall and by distance period
- **Most recent session**: Detailed stats from the latest practice session
- **Progress visualization**: SVG make-rate ring and progress bars
- **Course tracking**: Day-by-day progress through training courses

### 3. Course Management System

- **Enrollment tracking**: Monitor progress through multi-day courses
- **Day-by-day learning**: Structured content delivery
- **Completion tracking**: Visual indicators of course progress
- **Course completion flow**: Dedicated completion state once all days are done

### 4. Authentication & User Management

- **Clerk integration**: Secure authentication with social providers
- **Protected routes**: Route-level auth guards (`require-auth.jsx`)

### 5. Marketing & Onboarding

- **Landing pages**: Hero, features, testimonials, FAQ, pricing
- **Waitlist system**: Email capture for product launch
- **Course showcase**: Detailed course information pages
- **Dark/light mode**: System-aware theming with user control

## 🎨 Design System

### Color Palette

- **Primary**: Teal — `#0e7490` (light), `#6deaf9` (dark)
- **Accent**: Green — `#10b84e` (light), `#33cb6b` (dark); used for highlights, hovers, and accents
- **Clerk UI only**: The legacy Metallic Blue (`#22577A`) / Teal (`#38A3A5`) values are applied only to Clerk's components via `colorPrimary` (`app/root.tsx:66`), not the app theme
- **Neutral Gradients**: Sophisticated background effects
- **Dark Mode**: Full support with seamless theme transitions

### UI Patterns

- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Subtle Gradients**: Background effects for depth
- **Grid Overlays**: Technical, geometric aesthetic
- **Motion Design**: Smooth transitions using Motion

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
