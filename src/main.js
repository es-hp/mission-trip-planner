import "/src/css/main.css";
import createSidebar from "./js/layout/sidebar";
import createTopNav from "./js/layout/topnav";
import { getMaxWidth } from "./js/layout/getMaxWidth";

const sidebarContainer = document.querySelector(".sidebar");
if (sidebarContainer) createSidebar(sidebarContainer);

const topnavContainer = document.querySelector(".topnav");
if (topnavContainer) createTopNav(topnavContainer);

const mainID = document.querySelector("main")?.id;

function setMaxWidth() {
  document.querySelectorAll(".page > *").forEach((child) => {
    child.style.maxWidth = getMaxWidth() + "px";
  });
}
setMaxWidth();
window.addEventListener("resize", setMaxWidth);

if (mainID === "team") {
  const { default: membersTable } =
    await import("./js/components/team/membersTable");
  const teamContent = document.querySelector(".team-content");
  if (teamContent) membersTable(teamContent);
}

if (mainID === "finance") {
  const { default: financeTable } =
    await import("./js/components/finance/financeTable");
  const financeContent = document.querySelector(".finance-content");
  if (financeContent) financeTable(financeContent);
}

if (mainID === "schedule") {
  const { default: trainingCalendar } =
    await import("./js/components/schedule/trainingCalendar");
  const calendarDiv = document.getElementById("training-calendar");
  if (calendarDiv) trainingCalendar(calendarDiv);

  const { default: tripSchedule } =
    await import("./js/components/schedule/tripSchedule");
  const tripScheduleDiv = document.getElementById("trip-schedule");
  if (tripScheduleDiv) tripSchedule(tripScheduleDiv);

  const { default: scheduleTabNav } =
    await import("./js/components/schedule/scheduleTabNav");
  const tabNavDiv = document.querySelector("#schedule .tabNav");
  if (tabNavDiv) scheduleTabNav(tabNavDiv);
}
