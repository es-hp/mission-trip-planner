function initSidebar(el) {
  const state = localStorage.getItem("sidebarState");
  const isMobile = window.innerWidth < 768;

  if (state !== "open" || isMobile) {
    el.classList.add("close");
  }
}
