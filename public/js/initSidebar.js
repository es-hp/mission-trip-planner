function initSidebar() {
  const state = localStorage.getItem("sidebarState");
  const isMobile = window.innerWidth < 768;

  if (state !== "open" || isMobile) {
    document.documentElement.classList.add("sidebar-closed");
  }
}
