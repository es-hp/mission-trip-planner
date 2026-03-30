import { createEl } from "@utils";

export default function createModal({
  message,
  onConfirm,
  confirmBtnText = "Confirm",
  onCancel,
}) {
  const overlay = createEl("div", { className: "modal-overlay" });
  const modal = createEl("div", { className: "modal" });
  const bodyText = createEl("p", { textContent: message });
  const actions = createEl("div", { className: "modal-actions" });

  const confirmBtn = createEl("button", {
    textContent: confirmBtnText,
    className: "btn-primary",
  });

  const cancelBtn = createEl("button", {
    textContent: "Cancel",
    className: "btn-secondary",
  });

  const closeModal = () => overlay.remove();

  confirmBtn.addEventListener("click", () => {
    onConfirm?.();
    closeModal();
  });

  cancelBtn.addEventListener("click", () => {
    onCancel?.();
    closeModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") closeModal();
    },
    { once: true },
  );

  actions.append(cancelBtn, confirmBtn);
  modal.append(bodyText, actions);
  overlay.append(modal);
  document.body.append(overlay);
}
