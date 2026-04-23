import "@/css/main.css";
import {
  getCurrentDateTimeStr,
  getUsers,
  getCurrentUser,
  getUserById,
} from "@core/api";
import createSidebar from "@/js/layout/sidebar";
import createTopNav from "@/js/layout/topnav";
import { initTabNav } from "@/js/components/design-system/createTabNav";
import { Temporal } from "@js-temporal/polyfill";

const mainID = document.querySelector("main")?.id;

/* Mock "current time and date" */
const currentDateTimeStr = await getCurrentDateTimeStr();
const now = Temporal.ZonedDateTime.from(currentDateTimeStr);

/* Login Page */
if (mainID === "login") {
  const { default: initLoginPage } = await import("./js/pages/login");
  await initLoginPage();
}

const isLoggedIn = sessionStorage.getItem("is-logged-in") === "true";
if (!isLoggedIn && mainID !== "login") {
  window.location.href = "/login.html";
} else {
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  /* Navigation */
  const { getTripDetails } = await import("./js/core/api");
  const tripDetails = await getTripDetails();

  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    createSidebar(sidebar);
  }

  const topnavContainer = document.querySelector(".topnav");
  if (topnavContainer)
    createTopNav({
      container: topnavContainer,
      mainID,
      tripDetails,
      currentUser,
      users,
    });

  initTabNav();

  /* Initialize Page */
  switch (mainID) {
    case "overview": {
      const { default: initOverviewPage } = await import("./js/pages/overview");
      await initOverviewPage({ tripDetails, now });
      break;
    }

    case "team": {
      const { default: initTeamPage } = await import("./js/pages/team");
      await initTeamPage({ users });
      break;
    }

    case "schedule": {
      const { default: initSchedulePage } = await import("./js/pages/schedule");
      await initSchedulePage({ tripDetails, now });
      break;
    }

    case "profile": {
      const { default: initProfilePage } = await import("./js/pages/profile");
      await initProfilePage({ getUserById });
      break;
    }

    case "finance":
    case "travel-details":
    case "resources": {
      const { default: initConstructionPage } =
        await import("./js/pages/construction");
      await initConstructionPage({ mainID });
      break;
    }
  }
}
