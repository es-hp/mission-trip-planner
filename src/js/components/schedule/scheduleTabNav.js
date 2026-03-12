import createTabNav from "../design-system/createTabNav";

export default function scheduleTabNav(tabNavContainer) {
  const mainID = document.querySelector("main")?.id;
  const containers = [...document.querySelectorAll(`#${mainID} .tabNav ~ div`)];
  const contentDiv = document.querySelector(`#${mainID} .content`);

  const tabs = containers.map((container) => ({
    tabTitle: container.dataset.tabTitle,
  }));

  const changeContent = (key) => {
    containers.forEach((container) => {
      if (container.dataset.tabTitle == key) {
        contentDiv.append(container);
      } else {
        container.remove();
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
    sessionStorage.getItem(storageKey) ?? containers[0].dataset.tabTitle;
  tabNavContainer.querySelector(`[data-tab="${savedKey}"]`).click();
}
