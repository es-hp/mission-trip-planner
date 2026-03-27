import { createEl, formatDateTime } from "@utils";
import createTile from "../design-system/createTile";
import { getUserPosts } from "@/js/core/api";

export default async function userPrayers({ container, user }) {
  container.classList.add("tile");
  const body = [];

  const userId = user.id;
  const posts = await getUserPosts({ userId });

  posts.forEach((post) => {
    const postCard = createEl("div", {
      id: post.id,
      className: "prayer-request-post card",
    });
    const { date, time } = formatDateTime(post.createdAt, { month: "short" });
    const timestamp = createEl("div", {
      className: "post-timestamp",
      textContent: `Posted ${date} at ${time}`,
    });

    const prayedForm = createEl("form", {
      action: "#",
      className: "form-prayed",
      method: "post",
    });
    const submitCount = createEl("span", { className: "prayed-count" });
    const submitBtn = createEl("a", {
      href: "#",
      className: "prayed-submit-link",
      textContent: "prayed for this",
    });
    const inputPostId = createEl("input", {
      type: "hidden",
      name: "post_id",
      value: post.id,
    });
    prayedForm.append(submitCount, submitBtn, inputPostId);

    const postBody = createEl("div", { className: "prayer-request-body" });
    postBody.textContent = post.body;

    postCard.append(timestamp, prayedForm, postBody);
    body.push(postCard);
  });

  createTile({ container, header: "Prayer Requests", body });
}
