import "/src/css/main.css";
import createSidebar from "./js/layout/sidebar";
import createTopNav from "./js/layout/topnav";

const mainID = document.querySelector("main")?.id;

const sidebarContainer = document.querySelector(".sidebar");
if (sidebarContainer) createSidebar(sidebarContainer);

const topnavContainer = document.querySelector(".topnav");
if (topnavContainer) createTopNav(topnavContainer, { mainID });

/* Overview Page */
if (mainID === "overview") {
  const { getTripDetails } = await import("./js/core/api");
  const tripDetails = await getTripDetails();

  const { default: overviewBanner } =
    await import("./js/components/overview/overviewBanner");
  const bannerDiv = document.querySelector(".overview-banner");
  if (bannerDiv) overviewBanner(bannerDiv, tripDetails);

  const { default: pinnedNotes } =
    await import("./js/components/overview/pinnedNotes");
  const pinnedNotesDiv = document.querySelector(".pinned-notes");
  if (pinnedNotesDiv) pinnedNotes(pinnedNotesDiv, tripDetails);

  const { default: assignments } =
    await import("./js/components/overview/assignments");
  const assignmentsDiv = document.querySelector(".assignments");
  if (assignmentsDiv) await assignments(assignmentsDiv);
  // const test = await assignments(assignmentsDiv);
  // console.log(test);
}

/* Team Page */
if (mainID === "team") {
  const { default: membersTable } =
    await import("./js/components/team/membersTable");
  const teamContent = document.querySelector(".team-content");
  if (teamContent) membersTable(teamContent);
}

/* Finance Page */
if (mainID === "finance") {
  const { default: financeTable } =
    await import("./js/components/finance/financeTable");
  const financeContent = document.querySelector(".finance-content");
  if (financeContent) financeTable(financeContent);
}

/* Schedules Page */
if (mainID === "schedule") {
  const { default: trainingCalendar } =
    await import("./js/components/schedule/trainingCalendar");
  const calendarDiv = document.getElementById("training-calendar");
  if (calendarDiv) trainingCalendar(calendarDiv);

  const mountCallbacks = {};

  const { default: tripSchedule } =
    await import("./js/components/schedule/tripSchedule");
  const tripScheduleDiv = document.getElementById("trip-schedule");
  if (tripScheduleDiv) {
    await tripSchedule(tripScheduleDiv, {
      onMount: (fn) => {
        const tabTitle =
          tripScheduleDiv.closest("[data-tab-title]")?.dataset.tabTitle;
        mountCallbacks[tabTitle] = fn;
      },
    });
  }

  const { default: scheduleTabNav } =
    await import("./js/components/schedule/scheduleTabNav");
  const tabNavDiv = document.querySelector("#schedule .tabNav");
  if (tabNavDiv) scheduleTabNav(tabNavDiv, mountCallbacks);
}
