import { createEl } from "@core/utils";
import createTile from "../design-system/createTile";
import { Temporal } from "@js-temporal/polyfill";

export default function pinnedNotes({ container, tripDetails }) {
  const header = createEl("div", { className: "pinned-notes-header" });
  const pin = createEl("span", { className: "pin-icon", textContent: "📌" });
  const headerText = createEl("h2", { textContent: "Pinned Announcements" });

  header.append(pin, headerText);

  const dateTime = Temporal.PlainDateTime.from(
    tripDetails.pinnedNote.timePosted,
  );
  const date = dateTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePosted = createEl("div", {
    className: "pinned-notes-time",
    textContent: `Posted: ${date}`,
  });

  const body = createEl("div", {
    className: "note-text-content",
    textContent: tripDetails.pinnedNote.message,
  });

  body.prepend(timePosted);

  return createTile({ container, header, body });
}
