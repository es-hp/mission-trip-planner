import { createEl, createLucideIcon, getCSSVar } from "@core/utils";
import { logout } from "@core/auth";

const dropdownIconSize = getCSSVar("--dropdown-icon-size");

export default function createTopNav({
  container,
  mainID,
  tripDetails,
  currentUser,
} = {}) {
  const navContent = createEl("div", { className: "nav-content" });

  /* Site Title */
  const site = tripDetails["site"];
  const flagEmoji = tripDetails["flag"];
  const year = new Date(tripDetails["departureDateTime"]).getFullYear();
  const shortYear = "'" + String(year).slice(-2);

  const tripTitle = createEl("h1", {
    textContent: `${flagEmoji} ${site} ${shortYear}`,
  });

  /* Overview: Welcome User */
  const welcomeUser = createEl("div", {
    className: "top-nav-welcome",
    textContent: `Welcome ${currentUser.profile.preferredName}!`,
  });

  /* Search Bar */
  const searchBar = createEl("div", { className: "search-bar" });

  const searchInput = createEl("input");
  searchInput.setAttribute("id", "search-input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search...");

  const handleSearch = () => {
    const query = searchInput.value.trim();
    if (!query) return;
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const searchButton = createEl("button", { className: "search-btn" });
  const searchIcon = createLucideIcon("Search");
  searchButton.append(searchIcon);

  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  searchBar.append(searchInput, searchButton);

  /* Profile: Dropdown */
  const dropdown = createEl("div", { className: "dropdown" });
  const dropdownBtn = createEl("button", { id: "topnav-dropdown-btn" });

  const userImg = createEl("img", {
    className: "top-nav-avatar",
    alt: "profile",
    src: currentUser.profile.avatarURL,
  });

  const userIcon = createLucideIcon("CircleUserRound", { size: "2.25rem" });

  const userAvatar = currentUser ? userImg : userIcon;

  dropdownBtn.append(userAvatar);

  const dropdownMenu = createEl("ul", { className: "dropdown-menu" });

  const links = [
    { linkText: "profile", url: "#", icon: "UserRound" },
    { linkText: "link2", url: "#" },
  ];

  links.forEach((link) => {
    const linkLi = createEl("li", { className: "dropdown-li" });
    const linkEl = createEl("a", {
      textContent: link.linkText,
      href: link.url,
    });
    linkLi.append(linkEl);
    const icon = link.icon
      ? createLucideIcon(link.icon, { size: `${dropdownIconSize}` })
      : null;
    if (icon) linkLi.prepend(icon);
    dropdownMenu.append(linkLi);
  });

  const dividerLi = createEl("li", { className: "dropdown-divider-li" });
  const divider = createEl("hr");

  dividerLi.style.padding = "0 1rem";
  dividerLi.append(divider);

  const logoutLinkLi = createEl("li", { className: "dropdown-li logout-li" });
  const logoutLinkEl = createEl("button", { className: "logout-btn" });
  const logoutIcon = createLucideIcon("LogOut", {
    size: `${dropdownIconSize}`,
  });
  const logoutLabel = createEl("span", { textContent: "Sign out" });

  logoutLinkEl.append(logoutIcon, logoutLabel);
  logoutLinkLi.append(logoutLinkEl);

  dropdownMenu.append(dividerLi, logoutLinkLi);

  dropdown.append(dropdownBtn, dropdownMenu);

  /* Utility Nav */
  const utilityNav = createEl("nav", { className: "utility-nav" });

  utilityNav.append(searchBar, dropdown);

  /* Mount */
  if (mainID === "overview") {
    navContent.append(welcomeUser, utilityNav);
  } else {
    navContent.append(tripTitle, utilityNav);
  }
  container.append(navContent);

  /* Events */
  // Open & close dropdown menu
  dropdown.addEventListener("mouseover", (e) => {
    dropdownMenu.classList.add("open");
  });

  dropdown.addEventListener("mouseout", (e) => {
    dropdownMenu.classList.remove("open");
  });

  // Sign out
  logoutLinkEl.addEventListener("click", logout);
}
