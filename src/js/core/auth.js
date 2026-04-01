import { showInvalidMsg, clearInvalidMsgs, isEmailValid } from "@utils";
import { getUsers } from "./api";

export const authenticate = async ({ emailInput, passwordInput }) => {
  const users = await getUsers();

  const match = users.find(
    (user) =>
      user.personal.email === emailInput &&
      user.personal.password === passwordInput,
  );

  if (match) {
    sessionStorage.setItem("current-user", JSON.stringify(match));
  }

  return !!match;
};

export const login = async ({ form, button, emailEl, passwordEl }) => {
  const emailInput = emailEl.value.trim();
  const passwordInput = passwordEl.value;

  button.disabled = true;
  clearInvalidMsgs(form);

  let isValid = true;

  if (!emailInput) {
    showInvalidMsg({ inputEl: emailEl, message: "Email is required." });
    isValid = false;
  } else if (!isEmailValid(emailInput)) {
    showInvalidMsg({
      inputEl: emailEl,
      message: "Please enter a valid email.",
    });
    isValid = false;
  }

  if (!passwordInput) {
    showInvalidMsg({ inputEl: passwordEl, message: "Password is required." });
    isValid = false;
  } else if (passwordInput.length < 4) {
    showInvalidMsg({
      inputEl: passwordEl,
      message: "Password must be at least 4 characters.",
    });
    isValid = false;
  }

  if (!isValid) {
    button.disabled = false;
    return;
  }

  try {
    const success = await authenticate({ emailInput, passwordInput });

    if (success) {
      sessionStorage.setItem("is-logged-in", "true");
      form.style.border = "1px solid green";
      window.location.href = "/overview.html";
    } else {
      showInvalidMsg({
        className: "invalid-auth-msg",
        message: "Invalid email or password.",
      });
      passwordEl.value = "";
      passwordEl.focus();
    }
  } finally {
    button.disabled = false;
  }
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login.html";
};

export const authCheck = (ownerId) => {
  const currentUser = JSON.parse(
    sessionStorage.getItem("current-user") ?? "null",
  );
  const currentUserId = currentUser?.id;
  const isOwner = ownerId === currentUserId;
  return { isOwner, currentUser };
};
