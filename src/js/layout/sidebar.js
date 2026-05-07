import { createEl, createLucideIcon, getCSSVar } from "@core/utils";

const MD_BREAKPOINT = parseFloat(getCSSVar("--bp-md"));

export default function createSidebar(container) {
  const root = document.documentElement;

  /* State */
  let sidebarState = localStorage.getItem("sidebarState") ?? "closed";
  if (sidebarState === "closed") root.classList.add("sidebar-closed");

  const isStateOpen = () => sidebarState === "open";
  const shouldBeVisible = () =>
    isStateOpen() && window.innerWidth >= MD_BREAKPOINT;
  const isVisible = () => !root.classList.contains("sidebar-closed");

  /* Sidebar Header */
  const sidebarHeader = createEl("div", { className: "sidebar-header" });
  const sidebarLogo = createEl("div", { className: "sidebar-logo" });

  const logoIcon = createEl("img", {
    src: "/logos/lechu-go-logo-icon.png",
    alt: "logo",
    className: "logo-icon",
  });
  const logoText = createEl("img", {
    src: "/logos/lechu-go-logo-text.png",
    alt: "logo",
    className: "logo-text",
  });
  sidebarLogo.append(logoIcon, logoText);

  const iconCollapse = createLucideIcon("PanelLeftClose", {
    className: "icon-collapse nav-toggle",
  });

  const expandButton = createEl("div", { className: "expand-btn nav-toggle" });

  const iconExpand = createLucideIcon("PanelLeftOpen", {
    className: "icon-expand nav-toggle",
  });
  expandButton.append(iconExpand);

  sidebarHeader.append(sidebarLogo, iconCollapse, expandButton);

  /* Sidebar Body */
  const sidebarBody = createEl("nav", { className: "sidebar-body" });

  const pageIcons = {
    overview: "LayoutDashboard",
    team: "UsersRound",
    schedules: "CalendarDays",
    finance: "PiggyBank",
    "travel-details": "Plane",
    resources: "BookMarked",
  };

  Object.entries(pageIcons).forEach(([pageName, iconName]) => {
    const linkGroup = createEl("a", {
      className: "navlink-group",
      id: `navlink-group-${pageName}`,
      href: `/${pageName}.html`,
    });
    const icon = createLucideIcon(iconName);
    const linkText = createEl("span", {
      textContent: pageName,
      className: "navlink-text",
    });

    linkGroup.append(icon, linkText);
    sidebarBody.append(linkGroup);

    if (window.location.pathname === `/${pageName}.html`) {
      linkGroup.classList.add("active");
      linkGroup.ariaCurrent = "page";
      linkGroup.addEventListener("click", (e) => e.preventDefault());
    }
  });

  /* Sidebar Footer: Theme Change */
  const sidebarFooter = createEl("div", { className: "sidebar-footer" });

  const themeToggleWrapper = createEl("div", {
    className: "theme-toggle-wrapper",
  });
  const themeToggle = createEl("label", { className: "theme-toggle" });

  const themeText = createEl("span", { className: "theme-toggle-text" });

  const themeToggleInput = createEl("input", {
    type: "checkbox",
    className: "theme-toggle-input",
    attribute: { checked: false }, // default light mode
  });
  const themeToggleTrack = createEl("span", {
    className: "theme-toggle-track",
  });
  const themeToggleThumb = createEl("span", {
    className: "theme-toggle-thumb",
  });

  themeToggleTrack.append(themeToggleThumb);
  themeToggle.append(themeToggleInput, themeToggleTrack);
  themeToggleWrapper.append(themeToggle, themeText);

  sidebarFooter.append(themeToggleWrapper);

  // Set initial theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const theme = savedTheme ?? (prefersDark ? "dark" : "light");

  const setTheme = (theme, onToggle = false) => {
    document.documentElement.setAttribute("data-theme", theme);
    themeText.textContent = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
    if (onToggle) {
      localStorage.setItem("theme", theme);
    } else {
      themeToggleInput.checked = theme === "dark";
    }
  };

  setTheme(theme);

  // Theme change on toggle function
  themeToggleInput.addEventListener("change", (e) => {
    const theme = e.target.checked ? "dark" : "light";
    setTheme(theme, true);
  });

  // Theme change on OS appearance setting change
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const theme = e.matches ? "dark" : "light";
      localStorage.removeItem("theme");
      setTheme(theme);
    });

  /* Mount */
  container.append(sidebarHeader, sidebarBody, sidebarFooter);

  /* Sidebar Open/Close */

  const saveSidebarState = (state) => {
    sidebarState = state;
    if (state === null) {
      localStorage.removeItem("sidebarState");
    } else {
      localStorage.setItem("sidebarState", state);
    }
  };

  const linkTexts = sidebarBody.querySelectorAll(".navlink-text");
  const sidebarTexts = [...linkTexts, themeText];

  const setSidebarOpen = (open, { animate = true } = {}) => {
    if (open === isVisible()) return;

    if (!animate) {
      root.classList.toggle("sidebar-closed", !open);
      sidebarTexts.forEach((el) => el.classList.toggle("hide", !open));
      return;
    }

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== "width") return;

      root.classList.remove("sidebar-opening");
      root.classList.remove("sidebar-closing");
      root.removeEventListener("transitionend", handleTransitionEnd);
      if (root.classList.contains("sidebar-closed")) {
        sidebarTexts.forEach((el) => el.classList.add("hide"));
      }
    };

    container.addEventListener("transitionend", handleTransitionEnd);

    if (open) {
      root.classList.remove("sidebar-closing");
      root.classList.add("sidebar-opening");
      root.classList.remove("sidebar-closed");
      sidebarTexts.forEach((el) => el.classList.remove("hide"));
    } else {
      root.classList.remove("sidebar-opening");
      root.classList.add("sidebar-closing");
      root.classList.add("sidebar-closed");
    }
  };

  // Initialize Sidebar
  setSidebarOpen(isStateOpen(), { animate: false });

  /* Toggle Navbar Open/Close */
  sidebarHeader.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-toggle")) return;

    e.preventDefault();

    const isOpen = isStateOpen();
    const visible = isVisible();

    if (visible) {
      setSidebarOpen(false);
      saveSidebarState("closed");
      return;
    }

    setSidebarOpen(true);

    if (!isOpen) {
      saveSidebarState("open");
    }
  });

  const syncSidebarToViewport = () => {
    if (window.innerWidth < MD_BREAKPOINT && isVisible()) {
      setSidebarOpen(false);
    } else if (isStateOpen() && !isVisible()) {
      setSidebarOpen(true);
    }
  };

  /* Window Resize */
  window.addEventListener("resize", () => {
    syncSidebarToViewport();
  });
}
