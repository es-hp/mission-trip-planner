import { createEl } from "@core/utils";

export default function createTabNav(
  tabNavContainer,
  mainID,
  tabs,
  changeContent,
) {
  const TAB_KEY = `${mainID}-active-tab`; // For local/session storage

  tabs.forEach((tab) => {
    const tabButton = createEl("button", {
      className: "tab",
      textContent: tab.tabTitle.toUpperCase(),
    });
    const key = tab.tabTitle;

    tabButton.setAttribute("data-tab", key);
    tabNavContainer.append(tabButton);

    tabButton.addEventListener("click", () => {
      tabNavContainer
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tabButton.classList.add("active");
      sessionStorage.setItem(TAB_KEY, key);

      changeContent(key);
    });
  });

  return { storageKey: TAB_KEY };
}
