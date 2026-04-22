# 🌏 Lechu Go: Mission Trip Planner

A mock web application for organizing and managing short-term mission trips that helps churches and missions organizations plan their trips, manage training, and have all the resources in one place.

---

## 🌟 Highlights

---

## 🛠️ Built With

- **HTML5** - semantic structure using a multi-page layout with separate HTML files
- **CSS3** — responsive layouts (Grid/Flexbox) and theming via design tokens and CSS variables
- **JavaScript (ES2022+)** - modular, component-based architecture with data-driven UI and event-driven interactions
- **Temporal API** (`@js-temporal/polyfill`) — date/time management JavaScript API
- **Vite** — development server and build tooling
- **JSON (mock data)** — simulates API-driven data flow
- **Web Storage API** — `localStorage` and `sessionStorage` (persistent UI state)
- **Lucide Icons** — UI icon library

---

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

