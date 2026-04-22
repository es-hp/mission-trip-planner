import overviewBanner from "@/js/components/overview/overviewBanner";
import pinnedNotes from "@/js/components/overview/pinnedNotes";
import upcomingEvents from "@/js/components/overview/upcomingEvents";
import fundraisingProgress from "@/js/components/overview/fundraisingProgress";
import assignments from "@/js/components/overview/assignments";

export default async function initOverviewPage({ tripDetails, now }) {
  const bannerDiv = document.querySelector(".overview-banner");
  if (bannerDiv) overviewBanner({ container: bannerDiv, tripDetails, now });

  const pinnedNotesDiv = document.querySelector(".pinned-notes");
  if (pinnedNotesDiv) pinnedNotes({ container: pinnedNotesDiv, tripDetails });

  const upcomingDiv = document.querySelector(".upcoming-events");
  if (upcomingDiv) upcomingEvents({ container: upcomingDiv, tripDetails, now });

  const fundraisingDiv = document.querySelector(".fundraising-progress");
  if (fundraisingDiv)
    fundraisingProgress({ container: fundraisingDiv, tripDetails });

  const assignmentsDiv = document.querySelector(".assignments");
  if (assignmentsDiv) await assignments({ container: assignmentsDiv, now });

  // Sync assignments div height with right column
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
