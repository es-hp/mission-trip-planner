import {
  createEl,
  createLucideIcon,
  createCardIcon,
  formatDateTime,
  getCSSVar,
} from "@utils";
import createTile from "../design-system/createTile";
import { getUserPosts } from "@/js/core/api";

const openColor = getCSSVar("--color-text");
const closedColor = getCSSVar("--color-text-card-muted");
const urgentIconColor = getCSSVar("--color-red");

export default async function userPrayers({ container, user }) {
  const userId = user.id;
  const posts = await getUserPosts({ userId });
  const header = `${user.profile.preferredName}'s Prayer Requests`;
  const statusMap = {
    open: { text: "Open", color: openColor },
    closed: { text: "Closed", color: closedColor },
  };
  const body = [];

  const closedPosts = createEl("div", { className: "closed-posts" });

  posts.forEach((post) => {
    const postCard = createEl("article", {
      id: post.id,
      className: "prayer-request-post card",
    });

    /* Post Header */
    const header = createEl("header", { className: "post-header" });
    const icon = createCardIcon("prayingHands", "custom");
    const metadata = createEl("div", { className: "post-metadata" });

    const status = createEl("div", { className: "post-stauts" });
    status.textContent = `Status: ${statusMap[post.status].text}`;
    status.style.color = statusMap[post.status].color;

    const { date, time, zdtAttribute } = formatDateTime(post.createdAt, {
      month: "short",
    });

    const timestamp = createEl("time", {
      dateTime: zdtAttribute,
      className: "post-timestamp",
      textContent: `Posted ${date} at ${time}`,
    });

    metadata.append(status, timestamp);
    header.append(icon, metadata);

    if (post.isUrgent) {
      const urgentIcon = createLucideIcon("ClockAlert", {
        size: "1.25rem",
        strokeWidth: 2,
        color: urgentIconColor,
      });
      urgentIcon.style.marginLeft = "auto";
      urgentIcon.style.alignSelf = "flex-start";
      header.append(urgentIcon);
    }

    /* Post Body */
    const postBody = createEl("div", { className: "prayer-request-body" });
    const postContent = createEl("p", {
      className: "post-initial-content",
      textContent: post.content,
    });

    postBody.append(postContent);

    /* Updates */
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
          textContent: `Posted ${date} at ${time}`,
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
    const prayedCountForm = createEl("form", {
      action: "#",
      className: "form-prayed-count",
      method: "post",
    });
    const submitCount = createEl("span", {
      className: "prayed-count-text",
      textContent: "test text: Prayed for # times.",
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
    prayedCountForm.append(submitCount, submitBtn, inputPostId);

    postCard.append(header, postBody, prayedCountForm);

    if (post.status === "closed") {
      submitBtn.disabled = true;
      closedPosts.append(postCard);
    } else {
      body.push(postCard);
    }
  });

  const closedPostsContainer = createEl("details");
  const closedPostsToggle = createEl("summary", {
    className: "closed-posts-toggle",
    textContent: "See previous prayer requests",
  });

  closedPostsContainer.append(closedPostsToggle, closedPosts);
  body.push(closedPostsContainer);

  container.classList.add("tile");

  createTile({ container, header, body });
}
