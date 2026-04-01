import "/src/css/main.css";
import createSidebar from "./js/layout/sidebar";
import createTopNav from "./js/layout/topnav";
import { getCurrentDateTimeStr } from "./js/core/api";
import { Temporal } from "@js-temporal/polyfill";

const mainID = document.querySelector("main")?.id;

/* Mock "current time and date" */
const currentDateTimeStr = await getCurrentDateTimeStr();
const now = Temporal.ZonedDateTime.from(currentDateTimeStr);

/* Login Page */
if (mainID === "login") {
  const { default: loginBackground } =
    await import("./js/components/login/loginBackground");
  const loginMain = document.getElementById("login");
  if (loginMain) loginBackground({ container: loginMain });

  const { default: loginCard } =
    await import("./js/components/login/loginCard");
  const loginCardDiv = document.querySelector(".login-card");
  if (loginCardDiv) loginCard({ container: loginCardDiv });
}

const isLoggedIn = sessionStorage.getItem("is-logged-in") === "true";
const currentUser = JSON.parse(sessionStorage.getItem("current-user"));

if (isLoggedIn) {
  /* Navigation */
  const { getTripDetails } = await import("./js/core/api");
  const tripDetails = await getTripDetails();

  const sidebarContainer = document.querySelector(".sidebar");
  if (sidebarContainer) createSidebar(sidebarContainer);

  const topnavContainer = document.querySelector(".topnav");
  if (topnavContainer)
    createTopNav({
      container: topnavContainer,
      mainID,
      tripDetails,
      currentUser,
    });

  /* Overview Page */
  if (mainID === "overview") {
    const { getTripDetails } = await import("./js/core/api");
    const tripDetails = await getTripDetails();

    const { default: overviewBanner } =
      await import("./js/components/overview/overviewBanner");
    const bannerDiv = document.querySelector(".overview-banner");
    if (bannerDiv) overviewBanner({ container: bannerDiv, tripDetails, now });

    const { default: pinnedNotes } =
      await import("./js/components/overview/pinnedNotes");
    const pinnedNotesDiv = document.querySelector(".pinned-notes");
    if (pinnedNotesDiv) pinnedNotes({ container: pinnedNotesDiv, tripDetails });

    const { default: upcomingEvents } =
      await import("./js/components/overview/upcomingEvents");
    const upcomingDiv = document.querySelector(".upcoming-events");
    if (upcomingDiv)
      upcomingEvents({ container: upcomingDiv, tripDetails, now });

    const { default: fundraisingProgress } =
      await import("./js/components/overview/fundraisingProgress");
    const fundraisingDiv = document.querySelector(".fundraising-progress");
    if (fundraisingDiv)
      fundraisingProgress({ container: fundraisingDiv, tripDetails });

    const { default: assignments } =
      await import("./js/components/overview/assignments");
    const assignmentsDiv = document.querySelector(".assignments");
    if (assignmentsDiv) await assignments({ container: assignmentsDiv, now });

    const rightColumn = document.querySelector(".r-col");
    const assignmentsContent = document.querySelector(
      ".assignments .scroll-content",
    );

    const setAssignmentsDivHeight = () => {
      if (!assignmentsContent || !rightColumn) return;

      const rightcolHeight = rightColumn.getBoundingClientRect().height;

      assignmentsContent.style.maxHeight = rightcolHeight + "px";
    };

    setAssignmentsDivHeight();
    window.addEventListener("resize", setAssignmentsDivHeight);
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
    const { getTripDetails } = await import("./js/core/api");
    const tripDetails = await getTripDetails();

    const { default: trainingCalendar } =
      await import("./js/components/schedule/trainingCalendar");
    const calendarDiv = document.getElementById("training-calendar");
    if (calendarDiv)
      trainingCalendar({ container: calendarDiv, tripDetails, now });

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

  /* Profile Page */
  if (mainID === "profile") {
    const { default: userBio } =
      await import("./js/components/profile/userBio");
    const bioDiv = document.querySelector(".user-bio");
    if (bioDiv) userBio({ container: bioDiv, user: currentUser });

    const { default: userPrayers } =
      await import("./js/components/profile/userPrayers");
    const prayersDiv = document.querySelector(".user-prayers");
    if (prayersDiv)
      userPrayers({ container: prayersDiv, profileUser: currentUser });
  }
} else if (mainID !== "login") {
  window.location.href = "/login.html";
}
