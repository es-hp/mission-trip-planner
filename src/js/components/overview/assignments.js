import { createEl, createLucideIcon } from "../../core/utils";
import { getAssignments } from "../../core/api";
import createTile from "../design-system/createTile";
import { Temporal } from "@js-temporal/polyfill";

export default async function assignments({ container, now }) {
  /**
   * Fetches assignments from the API (mock JSON file).
   * @returns {Promise<Array>}
   * @example
   * [{ week: number, assignments: [{ title, details, resources: [type, url] }], dueDateTime }]
   */
  const weeklyAssignments = await getAssignments();
  const title = "Upcoming Assignments";
  const content = createEl("ul", { className: "week-list" });

  function formatDueDate(dateTimeZoneISO) {
    const date = Temporal.ZonedDateTime.from(dateTimeZoneISO);
    return date.toLocaleString("en-Us", {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  const passedWeekBlocks = [];

  weeklyAssignments.forEach((week) => {
    const weekBlock = createEl("li", { className: "week-block" });
    const weekHeader = createEl("div", { className: "week-header" });
    const accentBar = createEl("div", { className: "week-accent-bar" });
    const weekHeaderText = createEl("div", { className: "week-header-text" });
    const weekLabel = createEl("h3", { textContent: `Week ${week.week}` });
    const dueDate = createEl("span", {
      className: "due-date",
      textContent: `Due Date: ${formatDueDate(week.dueDateTime)}`,
    });
    const dueDateObj = Temporal.ZonedDateTime.from(week.dueDateTime);
    const isPassed = Temporal.ZonedDateTime.compare(now, dueDateObj) === 1;

    weekHeaderText.append(weekLabel, dueDate);
    weekHeader.append(accentBar, weekHeaderText);

    const assignmentsList = createEl("ul", { className: "assignments-list" });

    week.assignments.forEach((assignment) => {
      const block = createEl("li", { className: "assignment-block" });
      const title = createEl("span", {
        className: "assignment-title",
        textContent: assignment.title,
      });
      const details = createEl("p", {
        className: "assignment-details",
        textContent: assignment.details,
      });
      const resourceBlock = createEl("div", { className: "resource-block" });

      assignment.resources.forEach((resource) => {
        const iconMap = {
          video: "SquarePlay",
          PDF: "FileText",
          audio: "AudioLines",
        };
        const iconSVG = createLucideIcon(iconMap[resource.type]);
        const icon = createEl("a", {
          className: "resource-icon",
          href: resource.url,
          target: "_blank",
          rel: "noopener noreferrer",
        });
        icon.append(iconSVG);
        resourceBlock.append(icon);
      });

      block.append(title, details, resourceBlock);
      assignmentsList.append(block);
    });
    weekBlock.append(weekHeader, assignmentsList);

    if (isPassed) {
      weekBlock.classList.add("passed");
      passedWeekBlocks.push(weekBlock);
    } else {
      content.append(weekBlock);
    }
  });

  passedWeekBlocks.forEach((block) => content.append(block));

  return createTile({ container, title, content });
}
