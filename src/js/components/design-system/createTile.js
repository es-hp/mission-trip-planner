import { createEl } from "../../core/utils";

export default function createTile({ title, content }) {
  const tile = createEl("div", { className: "tile" });

  if (title) {
    const header = createEl("div", { className: "tile-header" });
    const titleH2 = createEl("h2", { textContent: title });
    header.append(titleH2);
    tile.append(header);
  }

  if (content) {
    const body = createEl("div", { className: "tile-body" });
    body.append(content);
    tile.append(body);
  }

  return tile;
}
