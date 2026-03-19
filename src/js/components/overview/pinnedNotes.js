import { createEl } from "@utils";
import createTile from "../design-system/createTile";

export default function pinnedNotes({ container, tripDetails }) {
  const content = createEl("div", { className: "pinned-content" });
  const pin = createEl("div", { className: "pin", textContent: "📌" });

  const note = createEl("div", {
    className: "note",
    textContent: tripDetails.pinnedNote,
  });

  content.append(pin, note);

  return createTile({ container, content });
}
