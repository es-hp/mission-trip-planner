import {
  createEl,
  createCardIcon,
  createLucideIcon,
  formatDateTime,
  getCSSVar,
  insertDescending,
  resizeTextareaHeight,
} from "@utils";
import createDropdown from "../design-system/createDropdown";
import createModal from "../design-system/createModal";
import { Temporal } from "@js-temporal/polyfill";

const openColor = getCSSVar("--color-text");
const closedColor = getCSSVar("--color-text-card-muted");
const dropdownIconSize = getCSSVar("--dropdown-icon-size");

export default function createPrayerRequestPost({
  post,
  closedPosts,
  openPosts,
  isOwner,
}) {
  const postCard = createEl("article", {
    id: post.id,
    className: "prayer-request-post card",
  });

  /* Post Header */
  const header = createEl("header", { className: "post-header" });
  const icon = createCardIcon("prayingHands", "custom");
  const metadata = createEl("div", { className: "post-metadata" });

  // Header: Status dropdown
  const statusEl = createEl("div", { className: "post-status-container" });
  const statusLabel = createEl("span", { textContent: "Status: " });

  let status = post.status;

  const optionsArr = [
    {
      value: "open",
      textContent: "Open",
      selected: status === "open",
    },
    {
      value: "closed",
      textContent: "Closed",
      selected: status === "closed",
    },
  ];

  const { dropdown: statusDropdown, select: statusSelect } = createDropdown({
    dropdownName: "status",
    dropdownId: "post-status",
    optionsArr,
  });

  const statusColors = { open: openColor, closed: closedColor };
  const statusWidths = { open: "4.25rem", closed: "5rem" };

  statusEl.style.color = statusColors[status] ?? null;
  statusSelect.style.color = statusColors[status] ?? null;
  statusSelect.style.width = statusWidths[status];

  statusSelect.addEventListener("change", (e) => {
    status = e.target.value;
    statusEl.style.color = statusColors[status] ?? null;
    statusSelect.style.color = statusColors[status] ?? null;
    statusSelect.style.width = statusWidths[status];

    if (status === "closed") {
      insertDescending({
        container: closedPosts,
        element: postCard,
        createdTime: post.createdAt,
        elClassName: "prayer-request-post",
        timestampClass: "post-timestamp",
      });
    } else {
      insertDescending({
        container: openPosts,
        element: postCard,
        createdTime: post.createdAt,
        elClassName: "prayer-request-post",
        timestampClass: "post-timestamp",
      });
    }
  });

  statusEl.append(statusLabel, statusDropdown);

  // Header: Timestamp
  const { date, time, zdtAttribute } = formatDateTime(post.createdAt, {
    month: "short",
  });

  const timestamp = createEl("time", {
    dateTime: zdtAttribute,
    className: "post-timestamp",
    textContent: `Posted ${date} at ${time}`,
  });

  // Header: Urgent Flag
  if (post.isUrgent) {
    const dividerDot = createEl("span", {
      className: "divider-dot",
      textContent: "•",
    });
    const urgentFlag = createEl("span", {
      className: "urgent-flag",
      textContent: "Urgent",
    });
    const urgentIcon = createLucideIcon("ClockAlert", {
      size: "1rem",
      strokeWidth: 2,
    });

    urgentFlag.prepend(urgentIcon);
    timestamp.append(dividerDot, urgentFlag);
  }

  metadata.append(statusEl, timestamp);
  header.append(icon, metadata);

  /* Post Body */
  const postBody = createEl("div", { className: "prayer-request-body" });
  let content = post.content;
  const postContent = createEl("p", {
    className: "post-initial-content",
    textContent: content,
  });
  postContent.style.whiteSpace = "pre-wrap";
  postBody.append(postContent);

  /* Edit Post */
  function editPost() {
    if (postBody.querySelector(".post-edit-textarea")) return;

    postContent.remove();
    const labelWrapper = createEl("label", {
      className: "post-edit-label",
    });
    const textarea = createEl("textarea", {
      name: `post-edit-${post.id}`,
      rows: 5,
      maxLength: 250,
      className: "post-edit-textarea",
    });
    textarea.value = content;
    resizeTextareaHeight(textarea);
    labelWrapper.append(textarea);

    // Edit Post: Actions Menu
    const editActions = createEl("div", {
      className: "post-edit-actions-container",
    });
    const editSaveBtn = createEl("button", {
      className: "post-edit-btn primary-btn",
      textContent: "Save Edits",
    });
    const cancelBtn = createEl("button", {
      className: "post-edit-cancel-btn btn-secondary",
      textContent: "Cancel",
    });

    editActions.append(cancelBtn, editSaveBtn);
    postBody.append(labelWrapper, editActions);

    // Edit Post: onCancel
    cancelBtn.addEventListener("click", () => {
      createModal({
        message: "Cancel changes to post?",
        onConfirm: () => {
          postBody.append(postContent);
          labelWrapper.remove();
          editActions.remove();
        },
      });
    });

    // Edit Post: onSave
    editSaveBtn.addEventListener("click", () => {
      editSaveBtn.disabled = true;
      const currentTime = Temporal.Now.instant().toString({
        fractionalSecondDigits: 3,
      });
      const { date, time, zdtAttribute } = formatDateTime(currentTime, {
        month: "short",
      });

      timestamp.textContent = `Edited ${date} at ${time}`;
      timestamp.dateTime = zdtAttribute;

      content = textarea.value;
      localStorage.setItem(`content-${post.authorId}-${post.id}`, content);
      postContent.textContent = content;
      postBody.append(postContent);

      editActions.remove();
      labelWrapper.remove();

      editSaveBtn.disabled = false;
    });
  }

  /* Delete Post */
  function deletePost() {
    createModal({
      message:
        "The prayer request and all its updates will be permanently deleted and cannot be undone. \n\nContinue to delete?",
      onConfirm: () => {
        localStorage.removeItem(`prayed_count_${post.id}`);
        postCard.remove();
      },
      confirmBtnText: "Delete",
    });
  }

  /* Header: Post Actions Dropdown Menu */
  if (isOwner) {
    const actionsDropdown = createEl("div", {
      className: "dropdown post-actions-dropdown",
    });
    const actionsMenuToggle = createEl("button", {
      className: "post-actions-toggle",
    });
    const ellipsis = createLucideIcon("Ellipsis");

    actionsMenuToggle.append(ellipsis);

    const actions = [
      { actionText: "edit", fn: editPost, icon: "SquarePen" },
      { actionText: "delete", fn: deletePost, icon: "Trash2" },
    ];

    const dropdownMenu = createEl("ul", { className: "dropdown-menu" });

    actions.forEach((action) => {
      const actionLi = createEl("li", { className: "dropdown-li" });
      const actionBtn = createEl("button", {
        textContent: action.actionText,
        className: `post-action-btn post-action-${action.actionText}`,
      });
      const icon = action.icon
        ? createLucideIcon(action.icon, { size: `${dropdownIconSize}` })
        : null;
      if (icon) actionBtn.prepend(icon);
      actionLi.append(actionBtn);
      dropdownMenu.append(actionLi);

      actionBtn.addEventListener("click", action.fn);
    });

    actionsDropdown.append(actionsMenuToggle, dropdownMenu);

    header.append(actionsDropdown);

    actionsMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!actionsDropdown.contains(e.target)) {
        dropdownMenu.classList.remove("open");
      }
    });
  }

  /* Post Updates */
  if (post.updates) {
    post.updates.forEach((update) => {
      const divider = createEl("hr", { className: "post-divider" });
      const updatePost = createEl("div", { className: "post-update" });
      const { date, time, zdtAttribute } = formatDateTime(update.createdAt, {
        month: "short",
      });
      const updateTimestamp = createEl("time", {
        dateTime: zdtAttribute,
        className: "post-timestamp",
        textContent: `Update: Posted ${date} at ${time}`,
      });
      const updateContent = createEl("p", {
        className: "post-update-content",
        textContent: update.content,
      });
      updatePost.append(updateTimestamp, updateContent);
      postBody.append(divider, updatePost);
    });
  }
  /* Post Footer */
  const footer = createEl("div", { className: "prayer-request-footer" });

  let count = parseInt(localStorage.getItem(`prayed_count_${post.id}`)) || 0;

  const submitCount = createEl("span", {
    className: "prayed-count-text",
    textContent: `Prayed for ${count} times`,
  });

  if (count > 0) footer.prepend(submitCount);

  if (!isOwner) {
    const prayedCountForm = createEl("form", {
      action: "#", // backend api URL
      className: "form-prayed-count",
      method: "post",
    });
    const submitBtn = createEl("button", {
      type: "submit",
      className: "prayed-submit-btn btn primary-btn",
      textContent: "Prayed for this",
    });
    const inputPostId = createEl("input", {
      type: "hidden",
      name: "post_id",
      value: post.id,
    });

    submitBtn.disabled = status === "closed";

    prayedCountForm.append(submitBtn, inputPostId);
    footer.append(prayedCountForm);

    /* Handle 'prayer for' button press */

    // Pause button until next day
    const startTimer = () => {
      submitBtn.classList.add("btn-paused");

      if (submitBtn._intervalId) clearInterval(submitBtn._intervalId);

      const update = () => {
        const currentTime = Temporal.Now.zonedDateTimeISO();

        const midnight = currentTime.with({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        const minsElapsed = Math.floor(
          midnight
            .until(currentTime, { largestUnit: "minutes" })
            .total({ unit: "minutes" }),
        );

        const widthPercent = Math.max(0, (minsElapsed / 1440) * 100);
        submitBtn.style.backgroundSize = `${widthPercent}% 100%`;

        if (minsElapsed >= 1440) {
          clearInterval(submitBtn._intervalId);
          submitBtn._intervalId = null;
          submitBtn.classList.remove("btn-paused");
        }
      };

      update();
      submitBtn._intervalId = setInterval(update, 60000);
    };

    // On form submit
    if (!localStorage.getItem(`was_prayed_for_${post.id}`)) {
      localStorage.setItem(`was_prayed_for_${post.id}`, "false");
    }

    prayedCountForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Just for mock form submission
      count++;

      // localStorage instead of backend data fetch
      localStorage.setItem(`prayed_count_${post.id}`, count);

      submitCount.textContent = `Prayed for ${count} times`;
      if (count === 1) footer.prepend(submitCount);

      startTimer();

      localStorage.setItem(`was_prayed_for_${post.id}`, "true");
    });

    const wasPrayedFor =
      localStorage.getItem(`was_prayed_for_${post.id}`) === "true";

    if (wasPrayedFor) startTimer();
  }

  postCard.append(header, postBody, footer);
  status === "closed"
    ? insertDescending({
        container: closedPosts,
        element: postCard,
        createdTime: post.createdAt,
        elClassName: "prayer-request-post",
        timestampClass: "post-timestamp",
      })
    : insertDescending({
        container: openPosts,
        element: postCard,
        createdTime: post.createdAt,
        elClassName: "prayer-request-post",
        timestampClass: "post-timestamp",
      });
}
