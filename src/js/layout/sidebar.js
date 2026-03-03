import {
  addImg,
  createNavLink,
  createLucideIcon,
  getCSSVar,
} from "../core/utils";

const MD_BREAKPOINT = parseFloat(getCSSVar("--bp-md"));

export default function createSidebar(container) {
  // State
  let sidebarSetting = localStorage.getItem("sidebarState"); // "open" | "closed" | null
  let wasAboveMdBreakPoint = window.innerWidth >= MD_BREAKPOINT;

  // Sidebar Header
  const sidebarHeader = document.createElement("div");
  sidebarHeader.className = "sidebar-header";

  const sidebarLogo = document.createElement("div");
  sidebarLogo.className = "sidebar-logo";

  const logoIcon = addImg("/logos/lechu-go-logo-icon.png", "logo", "logo-icon");
  const logoText = addImg("/logos/lechu-go-logo-text.png", "logo", "logo-text");
  sidebarLogo.append(logoIcon, logoText);

  const iconCollapse = createLucideIcon("PanelLeftClose");
  iconCollapse.classList.add("icon-collapse", "nav-toggle");

  const expandButton = document.createElement("div");
  expandButton.classList.add("expand-btn", "nav-toggle");

  const iconExpand = createLucideIcon("PanelLeftOpen");
  iconExpand.classList.add("icon-expand", "nav-toggle");
  expandButton.append(iconExpand);

  sidebarHeader.append(sidebarLogo, iconCollapse, expandButton);

  // Sidebar Body
  const sidebarBody = document.createElement("nav");
  sidebarBody.className = "sidebar-body";

  const pageIconsMap = new Map([
    ["LayoutDashboard", "overview"],
    ["UsersRound", "participants"],
    ["CalendarDays", "schedule"],
    ["PiggyBank", "finance"],
    ["Plane", "travel-details"],
    ["BookMarked", "resources"],
  ]);

  pageIconsMap.forEach((pageName, iconName) => {
    const linkGroup = createNavLink(pageName, `/${pageName}.html`);
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
