import { createEl } from "../../core/utils";

export default function createTile({ container, title, content }) {
  container.classList.add("tile");

  if (title) {
    const header = createEl("div", { className: "tile-header" });
    const titleH2 = createEl("h2", { textContent: title });
    header.append(titleH2);
    container.append(header);
  }

  if (content) {
    const body = createEl("div", { className: "tile-body" });
    body.append(content);
    container.append(body);
  }

  return container;
}
