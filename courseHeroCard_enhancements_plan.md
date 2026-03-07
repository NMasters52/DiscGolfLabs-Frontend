# Implementation Plan

## Overview

Enhance the CourseHeroCard component with a realistic Innova Discatcher-style disc golf basket silhouette, improved color contrast for better readability, and a gradient button for visual appeal.

## Context and Scope

The CourseHeroCard component currently has a simplistic disc golf basket SVG that doesn't accurately represent a PDGA-approved basket. The text readability is compromised by low opacity white text on a gradient background, and the white button with cyan text has poor contrast. This implementation will:

1. Replace the current basic SVG with a detailed, realistic Innova Discatcher-style basket featuring 18 chains, deflection bands, and proper basket construction
2. Improve badge background opacity from `bg-white/20` to `bg-white/35` for better text contrast
3. Change button from solid white to gradient `from-accent to-primary` with white text
4. Increase all text opacity from `text-white/90` to `text-white` (100%) for maximum readability

These changes will significantly improve the visual fidelity of the disc golf element while ensuring the component meets WCAG accessibility standards for text contrast.

## Types

No new types or interfaces required. The component will maintain its existing `CourseHeroCardProps` interface with optional `currentDay`, `totalDays`, `state`, and `stats` properties.

## Files

### Files to be Modified

**`/Users/nicholasmasters/coding/react/mastersDiscGolf/mastersDiscGolf-frontend/app/components/dashboard/cards/CourseHeroCard.tsx`**

This is the only file requiring modification. Changes will include:

1. **SVG Section Replacement** (lines ~33-75): Replace the current simplistic basket SVG with a detailed Innova Discatcher-style silhouette
2. **Badge Styling** (line ~84): Change `bg-white/20` to `bg-white/35`
3. **Button Styling** (lines ~116, 159): Change `bg-white text-primary` to `bg-gradient-to-r from-accent to-primary text-white`
4. **Typography Opacity** (lines ~89, 97, 102, 108, 125, 133, 138, 144): Change all `text-white/90` to `text-white`

No new files will be created and no files will be deleted.

## Functions

No new functions will be created. The existing `CourseHeroCard` component function will maintain its current signature and implementation structure, with only visual styling changes.

### Modified Function

**`CourseHeroCard`** in `/Users/nicholasmasters/coding/react/mastersDiscGolf/mastersDiscGolf-frontend/app/components/dashboard/cards/CourseHeroCard.tsx`

**Current Implementation:**

- Receives `currentDay`, `totalDays`, `state`, `stats` props
- Calculates progress percentage
- Renders card with simplistic basket SVG
- Uses `bg-white/20` for badge
- Uses `bg-white text-primary` for button
- Uses `text-white/90` for text

**Required Changes:**

- Replace SVG content with detailed Innova Discatcher basket (18 chains, deflection band, basket bands, central pole, top cap)
- Change badge className from `bg-white/20` to `bg-white/35`
- Change button className from `bg-white text-primary` to `bg-gradient-to-r from-accent to-primary text-white`
- Change all text className from `text-white/90` to `text-white`
- Maintain all existing Framer Motion animations
- Preserve all existing props and logic

## Classes

No new classes will be created. The component uses existing Tailwind CSS utility classes and Framer Motion components.

## Dependencies

No new dependencies required. The project already has:

- `framer-motion` (installed in previous implementation)
- `class-variance-authority` (for button variants)
- Existing shadcn/ui components

No version changes or package installations needed.

## Testing

### Testing Strategy

1. **Visual Verification**: Manually verify the new basket silhouette resembles an Innova Discatcher with 18 chains, deflection bands, and realistic basket body
2. **Contrast Testing**: Check that all text meets WCAG AA standards (4.5:1 ratio) on the gradient background
3. **Button Readability**: Ensure gradient button with white text is clearly visible and provides sufficient contrast
4. **Badge Visibility**: Verify darker badge background improves text readability while maintaining visual appeal
5. **Animation Integrity**: Confirm all Framer Motion animations (entrance, progress bar fill, button hover/tap) still function correctly
6. **Responsive Testing**: Verify component renders correctly on mobile and desktop viewports
7. **State Testing**: Test both `inCourse` and `courseComplete` states to ensure proper rendering

No automated test files will be created. Testing will be performed through visual inspection and browser dev tools.

## Implementation Order

1. **Replace SVG with detailed basket** - Create new Innova Discatcher-style SVG with 18 chains, deflection band, basket bands, central pole, and top cap
2. **Update badge styling** - Change badge background opacity from `bg-white/20` to `bg-white/35`
3. **Update button styling** - Change button to gradient `from-accent to-primary` with `text-white`
4. **Update text opacity** - Change all `text-white/90` to `text-white` throughout the component
5. **Test visual appearance** - Verify basket looks realistic and matches Innova Discatcher design
6. **Test contrast and readability** - Ensure all text and buttons meet accessibility standards
7. **Verify animations** - Confirm all Framer Motion animations work as expected
8. **Final review** - Complete visual inspection on both light and dark modes

This order ensures visual fidelity improvements are implemented first, followed by accessibility enhancements, with comprehensive testing at each stage.
