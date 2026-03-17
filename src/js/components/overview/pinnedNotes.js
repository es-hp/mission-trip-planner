import { createEl } from "../../core/utils";

export default function pinnedNotes(container, tripDetails) {
  const pin = createEl("div", { className: "pin", textContent: "📌" });

  const note = createEl("div", {
    className: "note",
    textContent: tripDetails.pinnedNote,
  });

  container.append(pin, note);

  return container;
}
