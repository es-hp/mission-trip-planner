import { createEl, createLucideIcon } from "@utils";
import { getTripDetails } from "../core/api";

export default async function createTopNav(container) {
  const navContent = createEl("div", { className: "nav-content" });

  /* Site Title */
  const tripDetails = await getTripDetails();
  const site = tripDetails["site"];
  const flagEmoji = tripDetails["flag"];
  const year = new Date(tripDetails["departureDateTime"]).getFullYear();
  const shortYear = "'" + String(year).slice(-2);

  const tripTitle = createEl("h1", {
    textContent: `${flagEmoji} ${site} ${shortYear}`,
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

  /* Utility Nav */
  const utilityNav = createEl("nav", { className: "utility-nav" });

  const userIcon = createLucideIcon("CircleUserRound", { size: "2.25rem" });

  utilityNav.append(searchBar, userIcon);

  /* Mount */
  navContent.append(tripTitle, utilityNav);
  container.append(navContent);
}
