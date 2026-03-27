import { createEl } from "@utils";

export default function createTile({ container, header, body }) {
  container.classList.add("tile");

  if (header) {
    if (typeof header === "string") {
      const tileHeader = createEl("header", { className: "tile-header" });
      const title = createEl("h2", { textContent: header });
      tileHeader.append(title);
      container.append(tileHeader);
    } else if (header instanceof Node) {
      container.append(header);
    }
  }

  if (body) {
    const tileBody = createEl("div", { className: "tile-body" });
    const children = Array.isArray(body) ? body : [body];
    tileBody.append(...children);
    container.append(tileBody);
  }

  return container;
}
