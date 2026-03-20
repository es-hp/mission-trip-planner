import { createEl } from "@utils";

export default function loginCard({ container }) {
  const leftContainer = createEl("div", { className: "login-left" });
  const rightContainer = createEl("div", { className: "login-right" });
  const logoContainer = createEl("div", { className: "login-logo-container" });
  const textContainer = createEl("div", { className: "login-text-container" });

  const logoIcon = createEl("img", {
    src: "/logos/lechu-go-logo-icon.png",
    alt: "logo",
    className: "login-logo-icon",
  });

  const logo = createEl("img", {
    src: "/logos/lechu-go-logo-basic.png",
    alt: "logo",
    className: "login-logo",
  });

  const tagline = createEl("div", {
    className: "login-tagline",
    textContent: `Lechu (לְכוּ) means go!`,
  });

  const heroText = createEl("p", {
    className: "login-hero-text",
    textContent:
      "A concept web app designed to help short-term missions teams from churches plan, organize, and manage all phases of the trip from training, departure and return.",
  });

  const welcomeText = createEl("h1", { textContent: "Welcome!" });
  const subheading = createEl("div", {
    className: "login-subheading",
    textContent: "Sign in below.",
  });
  const notice = createEl("div", { className: "login-notice" });

  const form = createEl("form", { action: "/submit", className: "login-form" });

  const inputGroupEmail = createEl("div", {
    className: "input-group login-email",
  });
  const labelEmail = createEl("label", { for: "email", textContent: "Email" });
  const inputEmail = createEl("input", {
    type: "email",
    id: "user-email",
    name: "user-email",
    required: true,
  });
  inputGroupEmail.append(labelEmail, inputEmail);

  const inputGroupPW = createEl("div", {
    className: "input-group login-password",
  });
  const labelPW = createEl("label", {
    for: "password",
    textContent: "Password",
  });
  const inputPW = createEl("input", {
    type: "password",
    id: "user-password",
    name: "user-password",
    required: true,
  });
  inputGroupPW.append(labelPW, inputPW);

  const submitBtn = createEl("button", {
    type: "submit",
    className: "primary-btn login-submit-btn",
    textContent: "Login",
  });

  form.append(inputGroupEmail, inputGroupPW, submitBtn);
  logoContainer.append(logo);
  textContainer.append(tagline, heroText);
  leftContainer.append(logoIcon, textContainer);
  rightContainer.append(welcomeText, subheading, notice, form);

  container.append(logoContainer, leftContainer, rightContainer);
}
