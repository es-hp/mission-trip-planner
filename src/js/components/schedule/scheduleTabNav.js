import createTabNav from "../design-system/createTabNav";

export default function scheduleTabNav(tabNavContainer, mountCallbacks = {}) {
  const mainID = document.querySelector("main")?.id;
  const sections = [
    ...document.querySelectorAll(`#${mainID} .tabNav ~ section`),
  ];
  const contentDiv = document.querySelector(`#${mainID} .content`);

  const tabs = sections.map((section) => ({
    tabTitle: section.dataset.tabTitle,
  }));

  const changeContent = (key) => {
    sections.forEach((section) => {
      if (section.dataset.tabTitle == key) {
        contentDiv.append(section);
        mountCallbacks[key]?.();
      } else {
        section.remove();
      }
    });
  };

  const { storageKey } = createTabNav(
    tabNavContainer,
    mainID,
    tabs,
    changeContent,
  );

  const savedKey =
    sessionStorage.getItem(storageKey) ?? sections[0].dataset.tabTitle;
  tabNavContainer.querySelector(`[data-tab="${savedKey}"]`).click();
}
