import { createEl } from "@utils";
import createTile from "../design-system/createTile";
import { Temporal } from "@js-temporal/polyfill";

export default function pinnedNotes({ container, tripDetails }) {
  const header = createEl("div", { className: "pinned-notes-header" });
  const leftGroup = createEl("div", { className: "pinned-notes-left" });
  const pin = createEl("span", { className: "pin-icon", textContent: "📌" });
  const headerText = createEl("h2", { textContent: "Pinned Announcements" });
  leftGroup.append(pin, headerText);

  const dateTime = Temporal.PlainDateTime.from(
    tripDetails.pinnedNote.timePosted,
  );
  const date = dateTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePosted = createEl("span", {
    className: "pinned-notes-time",
    textContent: `Posted: ${date}`,
  });

  header.append(leftGroup, timePosted);

  const body = createEl("div", {
    className: "note",
    textContent: tripDetails.pinnedNote.message,
  });

  return createTile({ container, header, body });
}
