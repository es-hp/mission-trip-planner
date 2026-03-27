import { createEl, createCardIcon, formatDateTime, getCSSVar } from "@utils";
import createTile from "../design-system/createTile";
import { getUserPosts } from "@/js/core/api";

const openColor = getCSSVar("--color-text");
const closedColor = getCSSVar("--color-text-card-muted");

export default async function userPrayers({ container, user }) {
  const userId = user.id;
  const posts = await getUserPosts({ userId });
  const header = `${user.profile.preferredName}'s Prayer Requests`;
  const statusMap = {
    open: { text: "Open", color: openColor },
    closed: { text: "Closed", color: closedColor },
  };
  const body = [];

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

    /* Post Body */
    const postBody = createEl("div", { className: "prayer-request-body" });
    postBody.textContent = post.content;

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
    const submitBtn = createEl("a", {
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
    body.push(postCard);
  });

  container.classList.add("tile");

  createTile({ container, header, body });
}
