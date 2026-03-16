# Little Lemon Restaurant Website

A sophisticated, responsive Mediterranean restaurant website built with React, demonstrating advanced frontend development skills, modern web technologies, and meticulous attention to user experience design.

## 🚀 Live Demo

**Experience the full application**: [cameroncarlyon.com/littlelemon](https://cameroncarlyon.com/littlelemon)

---

## 📋 Project Overview

Little Lemon represents a complete modern web application for a family-owned Mediterranean restaurant. This project demonstrates proficiency in contemporary web development practices, advanced React patterns, bespoke iconography using industry-standard design tools, sophisticated animations using GSAP and Lottie, and enterprise-level code architecture.

---

## 🛠️ Technical Architecture

### Core Technologies
- **Frontend Framework**: React 18.2+ with functional components and hooks
- **Routing**: React Router v6 with nested routing and dynamic navigation
- **Animations**: GSAP (GreenSock) with timeline-based motion graphics + Lottie integration
- **Styling**: Vanilla CSS with CSS custom properties, Flexbox, and Grid
- **Build System**: Create React App with custom webpack optimisations
- **Testing**: Jest and React Testing Library with unit and integration tests
- **Icons & Assets**: **Custom-designed iconography** created in Illustrator/After Effects, exported as SVG/Lottie animations

### Development Environment
- **Node.js**: v18+ with npm package management
- **Version Control**: Git with conventional commit messages
- **Code Quality**: ESLint, Prettier, and custom linting rules
- **Performance**: Lighthouse CI integration and Core Web Vitals monitoring

---

## 📁 Project Structure

### Root Directory Organization
```
LittleLemon/
├── public/                          # Static assets and index.html
│   ├── index.html                   # Main HTML template
│   ├── manifest.json                # PWA configuration
│   └── favicon.ico                  # Brand favicon
│
├── src/                             # Source code directory
│   ├── components/                  # Reusable UI components
│   │   ├── Header.js                # Navigation with mobile menu
│   │   ├── Footer.js                # Site footer with links
│   │   ├── HeroButton.js            # GSAP-animated CTA button
│   │   ├── MenuFilters.js           # Dynamic filtering system
│   │   ├── MenuItem.js              # Individual menu item card
│   │   ├── Promotion.js             # Newsletter signup banner
│   │   ├── ReservationForm.js       # Multi-step reservation form
│   │   ├── Cart.js                  # Shopping cart with validation
│   │   └── __tests__/               # Component unit tests
│   │
│   ├── pages/                       # Route-based page components
│   │   ├── Home.js                  # Landing page with hero video
│   │   ├── About.js                 # Restaurant information
│   │   ├── Menu.js                  # Menu with filtering & cart
│   │   ├── Reservations.js          # Booking system
│   │   ├── Cart.js                  # Checkout flow
│   │   └── SuccessPages/            # Confirmation pages
│   │
│   ├── context/                     # React Context providers
│   │   ├── CartContext.js           # Shopping cart state management
│   │   └── MenuContext.js           # Menu data and filtering logic
│   │
│   ├── assets/                      # Static assets and media
│   │   ├── images/                  # Optimised photography
│   │   │   ├── hero-video.webm      # Hero background video
│   │   │   ├── hero-video.mp4       # Video fallback
│   │   │   ├── hero-poster.jpg      # Video poster image
│   │   │   └── menu-items/          # Food photography
│   │   ├── icons/                   # Custom SVG iconography
│   │   ├── animations/              # Lottie JSON files
│   │   └── fonts/                   # Local .woff2 font files
│   │
│   ├── utils/                       # Utility functions and helpers
│   │   ├── api.js                   # API simulation functions
│   │   ├── validation.js            # Form validation helpers
│   │   └── constants.js             # Application constants
│   │
│   ├── App.js                       # Main application component
│   ├── App.css                      # Application-wide styles
│   ├── index.js                     # React application entry point
│   └── index.css                    # Global CSS reset and variables
│
├── .github/                         # GitHub configuration
│   ├── copilot-instructions.md      # Development guidelines
│   └── workflows/                   # CI/CD automation
│
├── package.json                     # Dependencies and scripts
├── README.md                        # Project documentation
├── LICENSE.md                       # Custom licensing terms
└── .gitignore                       # Git exclusion rules
```

### Key Component Architecture

#### **Core Navigation Components**
- **`Header.js`**: Responsive navigation with GSAP mobile menu animations
- **`Footer.js`**: Site-wide footer with contact information and social links

#### **Interactive Features**
- **`MenuFilters.js`**: Dynamic filtering system with Lottie animations
- **`MenuItem.js`**: Individual menu items with add-to-cart functionality
- **`Cart.js`**: Complete shopping cart with form validation and checkout flow
- **`ReservationForm.js`**: Multi-step reservation system with date/time selection

#### **User Experience Components**
- **`HeroButton.js`**: Reusable CTA button with GSAP hover animations
- **`Promotion.js`**: Newsletter signup with session-based dismissal
- **`SuccessPages/`**: Confirmation pages for reservations and orders

#### **State Management**
- **`CartContext.js`**: Shopping cart state with persistence and validation
- **`MenuContext.js`**: Menu data management and filtering logic

---

## ✨ Advanced Features & Capabilities

### 🎨 Frontend & Design
- **Mobile-First Responsive Design**: Pixel-perfect layouts across all device sizes
- **Advanced CSS Architecture**: Component-scoped styling with maintainable methodologies
- **Bespoke Iconography**: Designed and animated brand assets integrated seamlessly
- **Hero Background Video**: Seamlessly looping, compressed `.webm` with `.mp4` and poster `.jpeg` fallbacks
- **Accessible Typography**: Local optimised `.woff2` fonts replacing CDN bottlenecks

### 🍴 Interactive Functionality
- **Dynamic Menu Filtering**: Sort items by dietary preference, calories, and price
- **Cart & Checkout Flow**: State-managed shopping cart with validation
- **Reservation System**: Multi-step reservation form with confirmation pages
- **FAQ Section**: Interactive collapsible questions with smooth animations

### ♿ Accessibility
- **ARIA attributes** across interactive components
- **WCAG 2.2 AA compliance**
- **Keyboard Navigation**: Full accessibility without a mouse
- **Reduced Motion Support**: Respects OS-level motion preferences

### 🏗️ Architecture & Performance
- **Component-Based Design**: Reusable, composable React components
- **State Management**: Context API with optimised re-rendering
- **Performance Optimisation**: Lazy loading, code splitting, and bundle reduction
- **Cross-Browser Compatibility**: Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome

---

## 📊 Performance & Quality Metrics

### Google Lighthouse Scores (v2.0)
- **Performance**: **100**
- **Accessibility**: **100**
- **Best Practices**: **100**
- **SEO**: **100**

### Technical Specifications
- **Bundle Size**: < 500KB gzipped
- **Time to Interactive**: < 2s on 3G networks
- **Core Web Vitals**: Excellent ratings across metrics
- **Browser Support**: 95%+ global browser compatibility

### Testing Coverage
- **Unit Tests**: Jest coverage for core functionality
- **Integration Tests**: Validation of menu filtering, forms, and state management
- **Accessibility Tests**: Screen reader + keyboard navigation support

---

## 🏆 Technical Achievements in v2.0
- ✅ **Bespoke Iconography & Motion Graphics** created in Illustrator + After Effects, exported via Lottie  
- ✅ **Fluid, brand-consistent animations** powered by GSAP timelines  
- ✅ **Dynamic Filtering System** (dietary, calorie, price-based)  
- ✅ **Optimised Hero Video** using `.webm` format with fallbacks  
- ✅ **SEO & Social Media Optimisation** (meta tags, OpenGraph, structured data)  
- ✅ **Improved Accessibility** with ARIA attributes + WCAG 2.2 AA compliance  
- ✅ **Local Fonts** in `.woff2` format replacing CDN-hosted bottlenecks  
- ✅ **Cross-Browser Performance Improvements** validated against modern browsers  
- ✅ **Unit Testing with Jest** for reliability and maintainability  

---

## 📞 Professional Contact

**Cameron Carlyon** – Frontend Developer & Designer  
- **Portfolio**: [cameroncarlyon.com](https://cameroncarlyon.com)  
- **Email**: [chat@cameroncarlyon.com](mailto:chat@cameroncarlyon.com)  
- **LinkedIn**: [linkedin.com/in/cameroncarlyon](https://www.linkedin.com/in/cameroncarlyon/)  
- **GitHub**: [github.com/CameronCarlyon](https://github.com/CameronCarlyon)  

---

**Note**: This project is intended solely as a portfolio piece to demonstrate technical capabilities. The Little Lemon brand originates from the Meta Front-End Developer Certificate and has been adapted for educational and demonstration purposes. All original animated and static Little Lemon iconography are the intellectual property of Cameron Carlyon.