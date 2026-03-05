import "/src/css/main.css";
import createSidebar from "./js/layout/sidebar";
import createTopNav from "./js/layout/topnav";
import membersTable from "./js/components/membersTable";
import financeTable from "./js/components/financeTable";
import calendar from "./js/components/calendar";

const sidebarContainer = document.querySelector(".sidebar");
if (sidebarContainer) createSidebar(sidebarContainer);

const topnavContainer = document.querySelector(".topnav");
if (topnavContainer) createTopNav(topnavContainer);

const teamContent = document.querySelector(".team-content");
if (teamContent) membersTable(teamContent);

const financeContent = document.querySelector(".finance-content");
if (financeContent) financeTable(financeContent);

const calendarContainer = document.querySelector(".calendar");
if (calendarContainer) calendar(calendarContainer);
