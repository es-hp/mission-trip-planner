# 🌏 Lechu Go: Mission Trip Planner

A responsive web application for organizing and managing short-term mission trips that helps churches and missions organizations plan their trips, manage training, and have all the resources in one place.

## ℹ️ Overview

**Lechu** (לְכוּ) — Hebrew for "go" — is a mock client-facing web application designed to help teams plan and coordinate short-term mission trips. Built using only HTML, CSS, and vanilla JavaScript, and a small set of libraries, and without using UI frameworks (no React, Vue, or Angular).

## 🔑 Key Decisions

**Multi-page architecture with reusable components**
Rather than building a Single Page Application (SPA), the project uses a multi-page structure with separate HTML files for each view. This prioritizes core HTML/CSS/JS fundamentals through explicit page navigation, and DOM-driven rendering.

Within this structure, the project implements reusable JavaScript components, primarily as functions that generate and return DOM elements. It also includes a custom `TabNav` class responsible for managing its own state and lifecycle. This component-based approach improves modularity, scalability, and maintainability while remaining framework-free.

**Sidebar rendered in `<head>` to eliminate flash**
The sidebar is initialized from a separate `initSidebar.js` script loaded in the `<head>` of every HTML page rather than through the main module bundle at the end of `<body>`. Because navigating between pages causes a full page reload, this prevents the sidebar from visibly appearing late — making the experience feel closer to a SPA with no flicker or layout shift between navigations.

**Usage of Temporal API over native Date object**
The Temporal API was used for all date and time logic instead of JavaScript's built-in `Date` because Temporal works better with time zones, mutability, arithmetic, and formatting.

**Frozen "current time" for demo purposes**
Time dependent UI components like the countdown timer, calendar views, prayer request posts, assignment due dates, and in-progress event indicators is calculated relative to a fixed reference date instead of the real current time to ensure the app always displays relevant, active-looking data although the dates and times from the data are in the past.

**CRUD functionality via client-side storage**
The prayer request post system supports creating, editing, deleting, and responding to posts without a backend. Data is fetched from static JSON files and persisted using `localStorage` in place of a database. This was to demonstrate CRUD functionality while keeping the project frontend-only.

**Design token architecture and chip color system**
All colors are defined as CSS custom properties organized into a layered design token system, consisting of raw values, semantic aliases, and component-level variables. Light and dark themes override these tokens through theme-specific variables rather than component-level styling.

There is also a reusable chip color mapping system that standardizes how different categories are visually represented without hard-coding values. Each unqiue category, event, or tag is assigned a set of background, hover, and text colors dynamically, and cycles through the number of color sets defined.

## 🚀 Features

- **Overview Dashboard** — a dynamic bento-style grid home view composed of different widgets: a hero banner with trip details, pinned announcements, weekly assignments with resource links sorted by due date, upcoming training events with an in-progress indicator, and fundraising progress bars.
- **Prayer Requests Posts** — a post system on each member's profile where owners can create, edit, and delete requests with an urgency flag and open/closed status toggle, while other members can submit a "Prayed for this" response tracked with a daily cooldown.
- **Members Data Table** — a dynamic table that organizes member information across different tab views that show and hide relevant columns for each tab while persisting the active view with `sessionStorage`.
- **Trip Schedule Table** — a multi-day schedule grid built from API data (mock JSON file) that maps events to time slot rows with dynamic `rowspan`, color-coded event blocks by tag, and responsive event block height adjustments.
- **Monthly Calendar** — a custom monthly calendar component that renders events dynamically from data, supports month navigation with previous/next buttons and a "Today" shortcut, and auto-sizes cell heights responsively using a `ResizeObserver`.
- **Tab Navigation** — a custom tab component that dynamically builds tabs from `data-tab-title` sections, and persists the active tab per page using `sessionStorage`.
- **Responsive Sidebar** — a collapsible navigation bar that persists its last open/closed state across page navigation, and window resize.
- **Confirmation Modal** — a reusable dialog component for delete and confirmation actions, with customizable message, confirm/cancel callbacks, and an optional cancel button. Closes on backdrop click or Escape key.
- **Countdown Timer** — a real-time countdown timer ui component that displays remaining time until trip departure that dynamically resizes on smaller screens.
- **Search Bar** — a member search using partial string matching with result dropdown and direct profile navigation.
- **Mock Authentication** — simulates login flow using `sessionStorage` to persist login across page reloads.
- **Light and Dark Mode Toggle** — a theme toggle that persists the user's preference across sessions.

## 🛠️ Built With

- **HTML5** - semantic structure using a multi-page layout with separate HTML files
- **CSS3** — responsive layouts (Grid/Flexbox) and theming via design tokens and CSS variables
- **JavaScript (ES2022+)** - modular, component-based architecture with data-driven UI and event-driven interactions
- **Temporal API** (`@js-temporal/polyfill`) — date/time management JavaScript API
- **Vite** — development server and build tooling
- **JSON (mock data)** — simulates API-driven data flow
- **Web Storage API** — `localStorage` and `sessionStorage` (persistent UI state)
- **Lucide Icons** — UI icon library

## 🛠️ Project Structure

```
Root HTML entry points
├── construction.html
├── login.html
├── overview.html
├── profile.html
├── schedule.html
└── team.html

src/
├── css/
│   ├── components/            # Component-specific styles
│   ├── global/
│   │   ├── colors.css         # Design tokens and global color variables
│   │   └── fonts.css          # Typography and font definitions
│   ├── pages/                 # Page-specific styles 
│   └── main.css               # Global stylesheet entry point
├── data/                      # Static JSON payloads structured to emulate API responses
├── icons/                     # Custom SVG icons
├── js/
│   ├── components/
│   │   ├── design-system/     # Reusable UI components
│   │   ├── login/             # Page-specific components
│   │   ├── overview/
│   │   ├── profile/
│   │   ├── schedule/
│   │   └── team/
│   ├── core/
│   │   ├── api.js             # Data fetching
│   │   ├── auth.js            # Login, logout, authentication logic
│   │   └── utils.js           # Shared utilities (createEl, observeWidth, etc.)
│   ├── layout/
│   │   ├── sidebar.js
│   │   └── topnav.js
│   ├── pages/
│   │   ├── construction.js    # Shared entry module for pages under construction
│   │   ├── login.js           # Page entry modules (coordinates components, data, and logic)
│   │   ├── overview.js
│   │   ├── profile.js
│   │   ├── schedule.js
│   │   └── team.js
│   └── initSidebar.js
└── main.js                    # Application entry point (bootstraps global layout and initializes page modules)
```

## Running Locally
 
No build step required.
 
```bash
git clone https://github.com/es-hp/mission-trip-planner.git
cd mission-trip-planner
```
 
Open `index.html` in your browser, or serve it with any static file server:
 
```bash
npx serve .
```
 
## Author
 
**Helen Park**  
[Portfolio](https://yourportfolio.com) · [GitHub](https://github.com/es-hp) · [LinkedIn](https://www.linkedin.com/in/eshelenpark/)
