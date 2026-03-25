import { createEl } from "@utils";
import { login } from "@/js/core/auth";

export default function loginCard({ container }) {
  const leftContainer = createEl("div", { className: "login-left" });
  const rightContainer = createEl("div", { className: "login-right" });

  /* Left side container (About) */
  const leftTextContainer = createEl("div", { className: "login-left-text" });
  const logoContainer = createEl("div", { className: "login-logo-container" });

  const logoIcon = createEl("img", {
    src: "/logos/lechu-go-logo-icon.png",
    alt: "logo",
    className: "login-logo-icon",
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

  const logo = createEl("img", {
    src: "/logos/lechu-go-logo-basic.png",
    alt: "logo",
    className: "login-logo",
  });

  logoContainer.append(logo);
  leftTextContainer.append(tagline, heroText);
  leftContainer.append(logoIcon, leftTextContainer);

  /* Right side container (Login Form) */
  const rightTextContainer = createEl("div", { className: "login-right-text" });
  const welcomeText = createEl("h1", { textContent: "Welcome!" });
  const subheading = createEl("div", {
    className: "login-subheading",
    textContent: "Please use credentials below to sign in.",
  });
  const notice = createEl("div", { className: "login-notice" });
  notice.innerHTML = "test-user@example.com<br>testPassword#5";

  rightTextContainer.append(welcomeText, subheading, notice);

  // Build Form
  const form = createEl("form", {
    action: "/submit",
    id: "login-form",
    noValidate: true,
  });

  const inputGroupEmail = createEl("div", {
    className: "input-group login-email",
  });
  const labelEmail = createEl("label", { for: "email", textContent: "Email" });
  const inputEmail = createEl("input", {
    type: "email",
    id: "user-email",
    name: "user-email",
  });
  const invalidEmailMsg = createEl("div", {
    className: "invalid-msg hide",
    textContent: "Please enter a valid email.",
  });
  inputGroupEmail.append(labelEmail, inputEmail, invalidEmailMsg);

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
  });
  const invalidPWMsg = createEl("div", { className: "invalid-msg hide" });
  inputGroupPW.append(labelPW, inputPW, invalidPWMsg);

  const invalidAuth = createEl("div", {
    className: "invalid-msg hide invalid-auth-msg",
  });

  const submitBtn = createEl("button", {
    type: "submit",
    id: "login-submit-btn",
    className: "primary-btn",
    textContent: "Sign in",
  });

  form.append(inputGroupEmail, inputGroupPW, invalidAuth, submitBtn);
  rightContainer.append(rightTextContainer, form);

  container.append(logoContainer, leftContainer, rightContainer);

  /* Handle Login */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await login({
      form,
      button: submitBtn,
      emailEl: inputEmail,
      passwordEl: inputPW,
    });
  });
}
