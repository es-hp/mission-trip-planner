import { createEl } from "@utils";

export default function createTabNav(
  tabNavContainer,
  mainID,
  tabs,
  changeContent,
) {
  const TAB_KEY = `${mainID}-active-tab`; // For local/session storage

  tabs.forEach((tab, index) => {
    const tabButton = createEl("button", {
      className: "tab",
      textContent: tab.tabTitle.toUpperCase(),
    });
    tabNavContainer.append(tabButton);

    tabButton.addEventListener("click", () => {
      tabNavContainer
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tabButton.classList.add("active");
      sessionStorage.setItem(TAB_KEY, index);

      changeContent(index);
    });
  });

  return { storageKey: TAB_KEY };
}
