import {
  createEl,
  createNavLink,
  createLucideIcon,
  getCSSVar,
  capitalizeText,
} from "@core/utils";

const MD_BREAKPOINT = parseFloat(getCSSVar("--bp-md"));

export default function createSidebar(container) {
  // State
  let sidebarSetting = localStorage.getItem("sidebarState"); // "open" | "closed" | null
  let wasAboveMdBreakPoint = window.innerWidth >= MD_BREAKPOINT;

  // Sidebar Header
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

  // Sidebar Body
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
    const linkText = capitalizeText(pageName);

    const linkGroup = createNavLink(linkText, `/${pageName}.html`);
    const icon = createLucideIcon(iconName);
    linkGroup.prepend(icon);
    linkGroup.classList.add("navlink-group");
    linkGroup.id = `navlink-group-${pageName}`;
    sidebarBody.append(linkGroup);

    if (window.location.pathname === `/${pageName}.html`) {
      linkGroup.classList.add("active");
      linkGroup.ariaCurrent = "page";
      linkGroup.addEventListener("click", (e) => e.preventDefault());
    }
  });

  // Mount
  container.append(sidebarHeader, sidebarBody);

  // Sidebar Open/Close
  function setSidebarOpen(open, animate = true) {
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
  }

  function saveSidebarSetting(state) {
    sidebarSetting = state;
    if (state === null) {
      localStorage.removeItem("sidebarState");
    } else {
      localStorage.setItem("sidebarState", state);
    }
  }

  // Toggle
  sidebarHeader.addEventListener("click", (e) => {
    if (e.target.closest(".nav-toggle")) {
      e.preventDefault();
      const isOpen = !container.classList.contains("close");
      if (isOpen) {
        saveSidebarSetting("closed");
        setSidebarOpen(false);
      } else {
        saveSidebarSetting("open");
        setSidebarOpen(true);
      }
    }
  });

  // Window Resize
  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth < MD_BREAKPOINT;
    const crossedToMobile = wasAboveMdBreakPoint && isMobile;
    const crossedToDesktop = !wasAboveMdBreakPoint && !isMobile;

    if (crossedToMobile && sidebarSetting === "open") {
      setSidebarOpen(false);
    }

    if (crossedToDesktop && sidebarSetting === "open") {
      setSidebarOpen(true);
    }

    wasAboveMdBreakPoint = !isMobile;
  });
}
