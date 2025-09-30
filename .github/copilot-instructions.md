# Little Lemon Website - Copilot Instructions

## Project Overview

Little Lemon is a modern, responsive React application for a Mediterranean restaurant. This document provides guidelines for development to ensure consistency, performance, and adherence to industry standards.

## Architecture & Structure

### Project Structure
- Follow the established folder structure:
  ```
  src/
  ├── components/     # Reusable UI components
  ├── pages/          # Route-based page components
  ├── context/        # React context providers
  ├── assets/         # Static assets (images, icons)
  ├── App.js          # Main application component
  ├── index.css       # Global styles
  └── index.js        # Application entry point
  ```

### Component Architecture
- Use functional components with hooks
- Create small, focused components with single responsibilities
- Implement proper component composition to avoid prop drilling
- Use React.memo() for components that render often but rarely change

## Code Style & Conventions

### General Guidelines
- Use ES6+ features (destructuring, arrow functions, template literals)
- Follow DRY (Don't Repeat Yourself) principles
- Implement early returns to avoid deep nesting
- Use meaningful variable and function names

### React Patterns
- Use custom hooks to extract complex logic
- Implement proper state management using useState, useReducer, or context
- Handle side effects with useEffect and proper dependency arrays
- Use callbacks with useCallback where appropriate for event handlers
- Memoize expensive calculations with useMemo

## Animation Guidelines

### GSAP Integration
- Create reusable animation hooks for common patterns
- Use GSAP timelines for complex animation sequences
- For mobile navigation:
  - Use paused timelines with play()/reverse() pattern
  - Implement proper animation cleanup in useEffect returns
  - Avoid layout thrashing by batching DOM reads/writes

### Lottie Animations
- Keep Lottie JSON files optimized (<100KB where possible)
- Use the Lottie-React component with proper configuration
- Implement lazy loading for Lottie animations not visible on initial load
- Control playback with React state when appropriate

### Animation Performance
- Use transform and opacity for animations (avoid animating layout properties)
- Add will-change hints sparingly for complex animations
- Use GSAP's force3D for hardware acceleration on critical animations
- Test animations on lower-end devices to ensure smooth performance

## UI/UX Considerations

### Responsive Design
- Follow mobile-first approach with breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
  - Large Desktop: > 1315px

### Accessibility
- Implement proper semantic HTML
- Use ARIA attributes where appropriate
- Ensure keyboard navigation works correctly
- Maintain sufficient WCAG color contrast standards

## Performance Optimisation

### Code Splitting
- Implement React.lazy() and Suspense for route-based code splitting
- Consider component-level code splitting for large features

### Rendering Optimisation
- Prevent unnecessary re-renders using memo, useCallback, and useMemo
- Implement virtualization for long lists (menu items, etc.)
- Use React.Fragment to avoid unnecessary DOM nodes

### Asset Optimisation
- Optimize images before importing
- Consider using WebP format with fallbacks
- Implement proper lazy loading for off-screen images

## State Management

- Use CartContext.js for shopping cart functionality
- Keep state as local as possible
- Use React Context for truly global state only
- Consider state machines for complex UI interactions

## Testing Guidelines

- Write tests for critical user flows
- Test responsive behavior across different viewports
- Verify animations work correctly and don't cause layout issues
- Test performance on both high and low-end devices

## Styling Approach

- Use CSS custom properties for theming
- Follow existing color palette and typography
- Maintain consistent spacing using the established spacing system
- Ensure styles work across all supported browsers

## Cross-Browser & Device Support

- Support modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Implement iOS Safari specific fixes when needed
- Test on both iOS and Android mobile devices
- Ensure touch interactions work correctly

## Deployment Considerations

- Configure proper cache headers for assets
- Implement route-based code splitting for faster initial load
- Ensure proper basename ('/littlelemon') is set for React Router
- Test the production build locally before deployment

## Naming Conventions

- Components: PascalCase (e.g., HeroButton.js)
- Hooks: camelCase with 'use' prefix (e.g., useAnimationRefs)
- Files: Components match their export name
- CSS classes: Descriptive and component-scoped

## Documentation Expectations

- Add JSDoc comments for non-obvious functions
- Document complex animations with comments
- Keep the README.md updated with new features and changes
- Document props for reusable components

## Git Workflow

- Use meaningful commit messages
- Create feature branches for new functionality
- Review code for performance issues before merging
- Avoid committing large binary files to the repository