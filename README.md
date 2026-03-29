## Summary

Little Lemon is a responsive website for a fictional family-owned Mediterranean restaurant in Chicago, built with React, GSAP, and Lottie. The project originated from the Meta Front-End Developer Certificate and has since been rebuilt from the ground up as a portfolio piece, with custom-made iconography designed in Adobe Illustrator and animated in After Effects with a focus on accessibility and performance.

**Live Demo**: [cameroncarlyon.com/littlelemon](https://cameroncarlyon.com/littlelemon)

## Features

- **Custom Iconography & Animations**
  Original brand assets designed in Illustrator and After Effects, exported as Lottie animations and integrated throughout the interface.

- **Menu with Dynamic Filtering**
  Browse the menu and filter items by dietary preference, calorie count, and price. Add items to a state-managed shopping cart with full checkout flow.

- **Table Reservations**
  Multiple APIs and custom-built form components combine to produce a delightful reservation form with date, time, and guest count selection.

- **Hero Video**
  A looping background video in `.webm` with `.mp4` and poster `.jpg` fallbacks, optimised with FFmpeg for minimal data footprint.

- **Responsive Layout**
  Adapts to all screen sizes with GSAP-animated mobile navigation and timeline-based open/close animations.

- **Accessibility**
  Semantic HTML, ARIA attributes, keyboard navigation, and WCAG 2.2 AA colour contrast compliance.

- **Local Typography**
  Self-hosted `.woff2` fonts (Karla, Markazi Text) to avoid CDN bottlenecks.

## Tech Stack

- **Framework**: React 19 with functional components and hooks
- **Routing**: React Router v6
- **Animations**: GSAP + Lottie (via lottie-react)
- **Icons**: Font Awesome + custom Lottie assets
- **Styling**: Vanilla CSS with custom properties and Flexbox
- **Testing**: Jest + React Testing Library
- **Build**: Create React App

## Testing

Tests are written with Jest and React Testing Library, organised across three files:

- **`ContentRendering.test.js`** — Verifies that key content renders correctly, such as restaurant branding, location, navigation structure, and contact details.
- **`CoreFunctionality.test.js`** — Covers fundamental rendering behaviour: React component mounting, semantic heading structure, accessible list and button roles, and DOM element presence.
- **`FormInteraction.test.js`** — Tests form field rendering and user interactions, including input value changes, button click events, the reservation form (date, time, guest count, occasion), and the newsletter subscription form.

---

This project is intended as a portfolio piece. The Little Lemon brand originates from the Meta Front-End Developer Certificate. All original iconography and motion graphics are the intellectual property of Cameron Carlyon.

&copy; 2026 [Cameron Carlyon](https://cameroncarlyon.com) &bull; [Portfolio & Educational Use Licence](LICENSE.md)