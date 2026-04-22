import { createEl, createLucideIcon, getCSSVar } from "@core/utils";
import { logout } from "@core/auth";

const dropdownIconSize = getCSSVar("--dropdown-icon-size");

export default function createTopNav({
  container,
  mainID,
  tripDetails,
  currentUser,
  users,
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
  const searchBarWrapper = createEl("div", { className: "search-bar-wrapper" });
  const searchBar = createEl("div", { className: "search-bar" });
  const searchInputDiv = createEl("div", { className: "search-input-div" });

  const searchInput = createEl("input", {
    id: "search-input",
    type: "text",
    placeholder: "Search user...",
  });

  const resultsDropdown = createEl("ul", {
    className: "search-results-dropdown",
  });

  const handleSearch = () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) return;

    const matches = users.filter((user) =>
      user.profile.preferredName.toLowerCase().includes(query),
    );

    if (matches.length === 0) {
      const noMatch = createEl("li", {
        textContent: "No matching users found",
        className: "search-result-none",
      });
      resultsDropdown.append(noMatch);
      return;
    }

    matches.forEach((match) => {
      const result = createEl("li", {
        textContent: `${match.profile.preferredName} ${match.passport.lastName}`,
        className: "search-result-li",
      });

      const id = match.id.split("_")[1];

      result.addEventListener("click", () => {
        window.location.href = `profile.html?userId=${id}`;
      });
      resultsDropdown.append(result);
    });
  };

  document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target)) resultsDropdown.innerHTML = "";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      resultsDropdown.innerHTML = "";
      if (document.activeElement === searchInput) {
        searchInput.value = "";
      }
    }
  });

  const searchButton = createEl("button", { className: "search-btn" });
  const searchIcon = createLucideIcon("Search");
  searchButton.append(searchIcon);

  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  searchInputDiv.append(searchInput);
  searchBar.append(searchInputDiv, searchButton);
  searchBarWrapper.append(searchBar, resultsDropdown);

  /* Profile: Dropdown */
  const wrapper = createEl("div", { className: "topnav-avatar-wrapper" });
  const dropdown = createEl("div", { className: "dropdown-menu-container" });
  const dropdownBtn = createEl("button", { id: "topnav-dropdown-btn" });

  const userImg = createEl("img", {
    className: "top-nav-avatar",
    alt: "profile",
    src: currentUser.profile.avatarURL,
    dataset: { pinNopin: "true" },
  });

  const userIcon = createLucideIcon("CircleUserRound", { size: "2.25rem" });

  const userAvatar = currentUser ? userImg : userIcon;

  dropdownBtn.append(userAvatar);

  dropdownBtn.addEventListener("click", () => {
    window.location.href = `profile.html?userId=${id}`;
  });

  // Create dropdown menu
  const dropdownMenu = createEl("ul", { className: "dropdown-menu" });

  const id = currentUser.id.split("_")[1];

  const links = [
    {
      linkText: "profile",
      url: `profile.html?userId=${id}`,
      icon: "UserRound",
    },
    { linkText: "link2", url: "#" },
  ];

  links.forEach((link) => {
    const linkLi = createEl("li", { className: "dropdown-li" });
    const linkEl = createEl("a", {
      textContent: link.linkText,
      href: link.url,
    });
    const icon = link.icon
      ? createLucideIcon(link.icon, { size: `${dropdownIconSize}` })
      : null;
    if (icon) linkEl.prepend(icon);
    linkLi.append(linkEl);
    dropdownMenu.append(linkLi);
  });

  const dividerLi = createEl("li", { className: "dropdown-divider-li" });
  const divider = createEl("hr");

  dividerLi.append(divider);

  const logoutLinkLi = createEl("li", { className: "dropdown-li logout-li" });
  const logoutLinkEl = createEl("button", {
    className: "logout-btn",
    textContent: "Sign out",
  });
  const logoutIcon = createLucideIcon("LogOut", {
    size: `${dropdownIconSize}`,
  });

  logoutLinkEl.prepend(logoutIcon);
  logoutLinkLi.append(logoutLinkEl);

  dropdownMenu.append(dividerLi, logoutLinkLi);

  dropdown.append(dropdownBtn, dropdownMenu);
  wrapper.append(dropdown);

  /* Utility Nav */
  const utilityNav = createEl("nav", { className: "utility-nav" });

  utilityNav.append(searchBarWrapper, wrapper);

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
