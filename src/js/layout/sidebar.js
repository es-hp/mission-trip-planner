import { createEl, createLucideIcon, getCSSVar } from "@core/utils";

const MD_BREAKPOINT = parseFloat(getCSSVar("--bp-md"));

export default function createSidebar(container) {
  /* State */
  let sidebarSetting = localStorage.getItem("sidebarState"); // "open" | "closed" | null
  let wasAboveMdBreakPoint = window.innerWidth >= MD_BREAKPOINT;

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

  /* Toggle Element Visibility */
  // Elements to toggle visibility
  const linkTexts = sidebarBody.querySelectorAll(".navlink-text");
  const sidebarTexts = [...linkTexts, themeText];

  const transitionVisibility = (openSidebar, elements = sidebarTexts) => {
    elements.forEach((el) => el.classList.toggle("hide", !openSidebar));
  };

  /* Sidebar Open/Close */
  const setSidebarOpen = (open, { animate = true, onComplete } = {}) => {
    const isOpen = !container.classList.contains("close");

    if (open === isOpen) return;

    if (!animate) {
      container.classList.toggle("close", !open);
      return;
    }

    const handleTransitionEnd = (e) => {
      if (e.propertyName !== "width") return;

      container.classList.remove("opening");
      container.classList.remove("closing");
      container.removeEventListener("transitionend", handleTransitionEnd);
      if (onComplete) onComplete();
    };

    container.addEventListener("transitionend", handleTransitionEnd);

    if (open) {
      container.classList.remove("closing");
      container.classList.add("opening");
      container.classList.remove("close");
    } else {
      container.classList.remove("opening");
      container.classList.add("closing");
      container.classList.add("close");
    }
  };

  function saveSidebarSetting(state) {
    sidebarSetting = state;
    if (state === null) {
      localStorage.removeItem("sidebarState");
    } else {
      localStorage.setItem("sidebarState", state);
    }
  }

  /* Toggle Navbar Open/Close */
  sidebarHeader.addEventListener("click", (e) => {
    if (e.target.closest(".nav-toggle")) {
      e.preventDefault();
      const isOpen = !container.classList.contains("close");
      if (isOpen) {
        saveSidebarSetting("closed");
        setSidebarOpen(false, {
          onComplete: () => transitionVisibility(false),
        });
      } else {
        saveSidebarSetting("open");
        transitionVisibility(true);
        setSidebarOpen(true);
      }
    }
  });

  /* Window Resize */
  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth < MD_BREAKPOINT;
    const crossedToMobile = wasAboveMdBreakPoint && isMobile;
    const crossedToDesktop = !wasAboveMdBreakPoint && !isMobile;

    if (crossedToMobile && sidebarSetting === "open") {
      setSidebarOpen(false, {
        onComplete: () => transitionVisibility(false),
      });
    }

    if (crossedToDesktop && sidebarSetting === "open") {
      transitionVisibility(true);
      setSidebarOpen(true);
    }

    wasAboveMdBreakPoint = !isMobile;
  });

  /* Toggle Theme */
}
