import {
  createEl,
  createLucideIcon,
  createCardIcon,
  formatDateTime,
  getCSSVar,
} from "@utils";
import createDropdown from "../design-system/createDropdown";
import createTile from "../design-system/createTile";
import { getUserPosts } from "@/js/core/api";
import { CardSim } from "lucide";

const openColor = getCSSVar("--color-text");
const closedColor = getCSSVar("--color-text-card-muted");
const urgentIconColor = getCSSVar("--color-red");

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

    metadata.append(statusEl, timestamp);
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
      // const postActionsMenu = createEl("div", {
      //   className: "post-actions-menu",
      // });
      // const x = asd;
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

      submitBtn.disabled = post.status === "closed";

      prayedCountForm.append(submitBtn, inputPostId);
      footer.append(prayedCountForm);
    }

    postCard.append(header, postBody, footer);
    post.status === "closed"
      ? closedPosts.append(postCard)
      : openPosts.append(postCard);
  });

  closedPostsContainer.append(closedPostsToggle, closedPosts);
  body.push(openPosts, closedPostsContainer);

  container.classList.add("tile");

  createTile({ container, header, body });
}
