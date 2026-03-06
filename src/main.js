import "/src/css/main.css";
import createSidebar from "./js/layout/sidebar";
import createTopNav from "./js/layout/topnav";

const sidebarContainer = document.querySelector(".sidebar");
if (sidebarContainer) createSidebar(sidebarContainer);

const topnavContainer = document.querySelector(".topnav");
if (topnavContainer) createTopNav(topnavContainer);

const mainID = document.querySelector("main")?.id;

if (mainID === "team") {
  const { default: membersTable } =
    await import("./js/components/membersTable");
  const teamContent = document.querySelector(".team-content");
  if (teamContent) membersTable(teamContent);
}

if (mainID === "finance") {
  const { default: financeTable } =
    await import("./js/components/financeTable");
  const financeContent = document.querySelector(".finance-content");
  if (financeContent) financeTable(financeContent);
}

if (mainID === "schedule") {
  const { default: createCalendar } =
    await import("./js/components/createCalendar");
  const calendarContainer = document.getElementById("training-calendar");
  if (calendarContainer) createCalendar(calendarContainer);

  const { default: scheduleTabNav } =
    await import("./js/components/scheduleTabNav");
  const tabNavContainer = document.querySelector("#schedule .tabNav");
  if (tabNavContainer) scheduleTabNav(tabNavContainer);
}
