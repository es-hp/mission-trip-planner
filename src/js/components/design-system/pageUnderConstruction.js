import { createEl } from "@core/utils";

export default function pageUnderConstruction({ container }) {
  const header = createEl("header");
  const title = createEl("h2", { textContent: "Not Ready Yet!" });
  header.append(title);
  header.style.marginBottom = "2rem";

  const body = createEl("p", {
    textContent:
      "Thank you for checking out this project! New features like this page might be added in the future. Please enjoy looking through the other pages.",
  });
  body.style.maxWidth = "40rem";
  body.style.textWrap = "balance";

  container.style.padding = "3rem 2rem";

  container.append(header, body);
}
