Design Specification: Mobile Navigation System

Overview

A persistent, floating pill navigation for outdoor mobile use on a coaching platform. Optimized for one-handed operation, high contrast visibility, and clear hierarchy between primary and secondary actions.

Core Navigation Structure

Persistent Pill (Fixed Position)

Zone Position Function

Stats Left Navigate to statistics view

Course Center Navigate to main course content (primary action)

More Right Open sheet with secondary navigation

Visual Treatment

- Centered horizontally, elevated above safe area

- Solid background with shadow for depth

- High contrast against content

- Minimum 48dp touch targets per zone

- Haptic feedback on all taps

Sheet Behavior: More (⫶)

Trigger

Tap right zone of pill.

Animation Sequence

1. Pill slides downward and hides (150ms, ease-in)

2. Scrim fades in

3. Sheet rises from bottom (200ms, ease-out)

Dismissal

- Swipe down on drag handle

- Tap scrim

- Select any sheet item

Reverse Animation

Sheet descends, scrim fades, pill slides up (200ms, ease-in-out)

Sheet Content Order

Order Item Purpose

1 Dashboard Overview and daily summary

2 Course Alternative access to course

3 Profile User account and progress

4 Games Interactive learning activities

5 Stats Alternative access to statistics

6 Sign Out Session termination (destructive, muted)

Visual Hierarchy

- Current route highlighted when applicable

- Sign out separated visually at bottom

- No badges or dynamic indicators (clean, scannable)

Environmental Considerations

Factor Implementation

Bright sunlight Solid backgrounds, no transparency effects

Gloves/imprecision Large touch targets, forgiving tap areas

One-handed use Centered thumb zone, bottom placement

Interrupted Persistent visibility, no auto-hide

attention

Glare High contrast, no reliance on subtle shadows

State Management

Default State

Pill visible, content scrollable beneath.

Sheet Open State

Pill hidden, sheet overlays content, scrim active.

Navigation Transition

Sheet closes automatically on item selection, pill returns, new route loads.

Accessibility Requirements

- Minimum touch target: 48dp

- Sufficient color contrast for outdoor readability

- Haptic feedback on all interactions

- Screen reader labels for all navigation items

- Focus management on sheet open/close
