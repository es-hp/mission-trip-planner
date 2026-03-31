import {
  createEl,
  createLucideIcon,
  createCardIcon,
  formatDateTime,
  getCSSVar,
  resizeTextareaHeight,
} from "@utils";
import createDropdown from "../design-system/createDropdown";
import createModal from "../design-system/createModal";
import createTile from "../design-system/createTile";
import { getUserPosts, getCurrentDateTime } from "@/js/core/api";
import { Temporal } from "@js-temporal/polyfill";

const openColor = getCSSVar("--color-text");
const closedColor = getCSSVar("--color-text-card-muted");
const dropdownIconSize = getCSSVar("--dropdown-icon-size");

export default async function userPrayers({ container, user }) {
  const profileUserId = user.id;
  const posts = await getUserPosts(profileUserId);
  const currentUserId = JSON.parse(
    sessionStorage.getItem("current-user") ?? "null",
  )?.id;
  const isOwnProfile = profileUserId === currentUserId;

  const header = `${user.profile.preferredName}'s Prayer Requests`;
  const body = [];

  const openPosts = createEl("div", {
    className: "open-posts",
  });
  const closedPostsContainer = createEl("details");
  const closedPostsToggle = createEl("summary", {
    className: "closed-posts-toggle",
    textContent: "See previous prayer requests",
  });
  const closedPosts = createEl("div", { className: "closed-posts" });

  const insertDescending = (container, card, createdAt) => {
    const cards = [...container.querySelectorAll(".prayer-request-post")];
    const nextCard = cards.find(
      (c) =>
        Temporal.Instant.compare(
          Temporal.Instant.from(c.querySelector(".post-timestamp").dateTime),
          Temporal.Instant.from(createdAt),
        ) === -1,
    );
    nextCard ? container.insertBefore(card, nextCard) : container.append(card);
  };

  posts.forEach((post) => {
    const postCard = createEl("article", {
      id: post.id,
      className: "prayer-request-post card",
    });

    /* Post Header */
    const header = createEl("header", { className: "post-header" });
    const icon = createCardIcon("prayingHands", "custom");
    const metadata = createEl("div", { className: "post-metadata" });

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
        insertDescending(closedPosts, postCard, post.createdAt);
      } else {
        insertDescending(openPosts, postCard, post.createdAt);
      }
    });

    statusEl.append(statusLabel, statusDropdown);

    const { date, time, zdtAttribute } = formatDateTime(post.createdAt, {
      month: "short",
    });

    const timestamp = createEl("time", {
      dateTime: zdtAttribute,
      className: "post-timestamp",
      textContent: `Posted ${date} at ${time}`,
    });

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

    /* Actions for the owner of the post */
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

      editSaveBtn.addEventListener("click", async () => {
        editSaveBtn.disabled = true;
        try {
          /** Would use Temporal.Now.Instant.toString() in production. */
          const { currentDateTime } = await getCurrentDateTime();

          const { date, time, zdtAttribute } = formatDateTime(currentDateTime, {
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
        } finally {
          editSaveBtn.disabled = false;
        }
      });
    }

    function deletePost() {
      createModal({
        message:
          "The prayer request and all its updates will be permanently deleted and cannot be undone. \n\nContinue to delete?",
        onConfirm: () => {
          postCard.remove();
        },
        confirmBtnText: "Delete",
      });
    }

    /* Header: Post Actions Menu */
    if (isOwnProfile) {
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
    }

    /* Update Posts */
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
    const submitCount = createEl("span", {
      className: "prayed-count-text",
      textContent: "test text: Prayed for # times.",
    });
    footer.append(submitCount);

    if (isOwnProfile) {
    } else {
      const prayedCountForm = createEl("form", {
        action: "#",
        className: "form-prayed-count",
        method: "post",
      });
      const submitBtn = createEl("button", {
        href: "#",
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
    }

    postCard.append(header, postBody, footer);
    status === "closed"
      ? closedPosts.append(postCard)
      : openPosts.append(postCard);
  });

  closedPostsContainer.append(closedPostsToggle, closedPosts);
  body.push(openPosts, closedPostsContainer);

  container.classList.add("tile");

  createTile({ container, header, body });
}
