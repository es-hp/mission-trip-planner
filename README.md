# 🌏 Lechu Go: Mission Trip Planner

A mock web application for organizing and managing short-term mission trips that helps churches and missions organizations plan their trips, manage training, and have all the resources in one place.

---

## 🌟 Highlights

---

## ✅ Features

- **Login UI** - frontend-only mock authentication using `sessionStorage` to persist login across page reloads.
- **Collapsible Sidebar** - a responsive navigation bar that persists its last open/closed state across page navigation, and window resize.
- **Search Bar** - a user search functionality using partial string matching with result dropdown and direct profile navigation.
- **User Profile** -
- **Prayer Requests Posts** - a post system on each member's profile where owners can create, edit, and delete requests with an urgency flag and open/closed status toggle, while other members can submit a "Prayed for this" response tracked with a daily cooldown.
- **Overview Dashboard** - a dynamic bento-style grid home view composed of different widgets: a hero banner with trip details, pinned announcements, weekly assignments with resource links sorted by due date, upcoming training events with an in-progress indicator, and fundraising progress bars.
- **Countdown Timer** - a real-time countdown timer ui component that displays remaining time until trip departure that dynamically resizes on smaller screens.
- **Tab Navigation** - a custom tab component that dynamically builds tabs from `data-tab-title` sections, and persists the active tab per page using `sessionStorage`.
- **Members Data Table** - a dynamic table that organized member information across different tab views that show and hide relevant columns for each tab while persisting the active view with `sessionStorage`.
- **Monthly Calendar** - a custom monthly calendar component that renders events dynamically from data, has month navigation with previous/next buttons and a "Today" shortcut, and auto-sizes cell heights responsively using a `ResizeObserver`.
- **Trip Schedule Table** - a multi-day schedule grid built from API data (mock JSON file) that maps events to time slot rows with dynamic `rowspan`, color-coded event blocks by event type, and responsive event block height adjustments.

