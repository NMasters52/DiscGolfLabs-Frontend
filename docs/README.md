# Masters Disc Golf Documentation

This directory contains all project documentation organized by category.

## Project Structure

```
docs/
├── README.md                    # This file - documentation index
├── project-implementation.md    # Main project implementation plan
├── todo.md                      # Project tasks and todos
└── components/                  # Component-specific documentation
    ├── README.md                # Component documentation index
    ├── DiscGolfLabBackground.md # Card background system
    └── CourseHeroCard.md        # Course hero card component
```

## Quick Links

### Project Documentation

- [Project Implementation Plan](./project-implementation.md) - Overview of the main project implementation
- [Project Todo List](./todo.md) - Tasks and roadmap

### Component Documentation

- [Component Index](./components/README.md) - All component documentation
- [DiscGolfLabBackground](./components/DiscGolfLabBackground.md) - Card background system with themed animations
- [CourseHeroCard](./components/CourseHeroCard.md) - Course hero card implementation plan

## How to Reference Documentation for AI Assistant

When requesting work on components or features, reference the relevant documentation file:

**Example requests:**

- "Refer to `/docs/components/DiscGolfLabBackground.md` when implementing new dashboard cards"
- "Follow the patterns in `/docs/components/CourseHeroCard.md` for the new course card"
- "Check `/docs/project-implementation.md` for the overall architecture context"

The AI assistant will read the referenced documentation and follow the documented patterns, best practices, and implementation guidelines.

## Documentation Standards

All component documentation should include:

1. **Quick Reference** - Basic usage example at the top
2. **Props/API Reference** - Table of all props with types and descriptions
3. **Required Usage Pattern** - Essential rules for using the component
4. **Implementation** - Full component code with comments
5. **Examples** - Real-world usage examples
6. **Design Principles** - Guidelines for consistent usage

This structure ensures consistency across all documentation and makes it easy for both developers and AI assistants to understand and implement components correctly.
