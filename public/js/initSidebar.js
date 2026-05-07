function initSidebar() {
  const root = document.documentElement;
  const state = localStorage.getItem("sidebarState") ?? "closed";

  if (state === "closed" || window.innerWidth < 768) {
    root.classList.add("sidebar-closed");
    root.classList.add("sidebar-no-transition");
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        root.classList.remove("sidebar-no-transition"),
      ),
    );
  }
}
