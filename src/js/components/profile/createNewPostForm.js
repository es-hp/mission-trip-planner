import { createEl, resizeTextareaHeight } from "@utils";
import createModal from "../design-system/createModal";
import createPrayerRequestPost from "./createPrayerRequestPost";
import { Temporal } from "@js-temporal/polyfill";

export default function createNewPostForm({
  currentUser,
  openPosts,
  closedPosts,
  isOwnProfile,
  nextPostIdNum,
  onPostCreated,
}) {
  /* Build Form */
  const newPostForm = createEl("form", { className: "new-post-form" });
  const header = createEl("h3", { textContent: "Create New Prayer Request" });

  const urgencyInputDiv = createEl("div", {
    className: "new-post-urgency-div",
  });
  const urgencyLabel = createEl("label", {
    for: "new-post-urgency",
    textContent: "Is this an urgent request?",
  });
  const urgencyCheckbox = createEl("input", {
    type: "checkbox",
    id: "new-post-urgency",
    name: "isUrgent",
    value: "true",
    className: "checkbox",
  });

  urgencyInputDiv.append(urgencyLabel, urgencyCheckbox);

  const textareaLabel = createEl("label", {
    className: "compose-new-post-label",
  });
  const textarea = createEl("textarea", {
    name: `compose-new-post`,
    rows: 5,
    maxLength: 250,
    className: "compose-new-post-textarea",
  });
  resizeTextareaHeight(textarea);
  textareaLabel.append(textarea);

  /* Build Actions Menu */
  const newPostFormActions = createEl("div", {
    className: "new-post-actions",
  });
  const cancelNewPostBtn = createEl("button", {
    className: "btn-secondary",
    textContent: "Cancel",
  });

  const submitBtnText = "Create";
  const submitNewPostBtn = createEl("button", {
    className: "primary-btn",
    textContent: submitBtnText,
  });

  newPostFormActions.append(cancelNewPostBtn, submitNewPostBtn);

  newPostForm.append(
    header,
    urgencyInputDiv,
    textareaLabel,
    newPostFormActions,
  );

  /* Action Button Click Event Handlers */
  cancelNewPostBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createModal({
      message: "Cancel create new post?",
      onConfirm: () => {
        newPostForm.remove();
      },
    });
  });

  submitNewPostBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitNewPostBtn.disabled = true;
    submitNewPostBtn.textContent = "Creating";

    const timestamp = Temporal.Now.instant().toString({
      fractionalSecondDigits: 3,
    });

    if (textarea.value.trim() === "") {
      createModal({
        message: "The post cannot be empty.",
        confirmBtnText: "Go Back",
        onConfirm: () => {
          const overlay = document.querySelector(".modal-overlay");
          overlay.remove();
        },
        removeCancelBtn: true,
      });
    } else {
      const newPostObj = {
        id: `post_${nextPostIdNum}`,
        parentId: null,
        authorId: currentUser.id,
        status: "open",
        isUrgent: urgencyCheckbox.checked,
        content: textarea.value.trim(),
        createdAt: timestamp,
        updates: [],
      };

      createPrayerRequestPost({
        post: newPostObj,
        closedPosts,
        openPosts,
        isOwnProfile,
      });

      submitNewPostBtn.disabled = false;
      submitNewPostBtn.textContent = submitBtnText;

      onPostCreated(); // For the workaround to get next id
      newPostForm.remove();
    }
  });

  return newPostForm;
}
