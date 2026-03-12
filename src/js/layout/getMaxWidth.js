import { observeWidth } from "../core/utils";

export const getMaxWidth = () => {
  const sidebar = document.querySelector(".sidebar");
  const mainContainer = document.querySelector(".main");

  const calculate = () => {
    const padding = parseFloat(getComputedStyle(mainContainer).paddingLeft);
    const sidebarWidth = sidebar.getBoundingClientRect().width;
    return window.innerWidth - sidebarWidth - padding * 2;
  };

  window.addEventListener("resize", calculate);
  observeWidth(sidebar, calculate);

  return calculate();
};
