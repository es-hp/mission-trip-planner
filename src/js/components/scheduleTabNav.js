import createTabNav from "./createTabNav";

export default function scheduleTabNav(tabNavContainer) {
  const mainID = document.querySelector("main")?.id;

  const tabs = [
    { tabTitle: "Training Schedule" },
    { tabTitle: "Trip Schedule" },
  ];

  const trainingContainer = document.getElementById(
    "training-schedule-container",
  );
  const tripContainer = document.getElementById("trip-schedule-container");

  const changeContent = (index) => {
    trainingContainer.classList.toggle("hide", index !== 0);
    tripContainer.classList.toggle("hide", index !== 1);
  };

  const { storageKey } = createTabNav(
    tabNavContainer,
    mainID,
    tabs,
    changeContent,
  );
}
