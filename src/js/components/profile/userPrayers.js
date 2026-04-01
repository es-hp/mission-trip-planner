import { createEl, createLucideIcon, getNextPostId } from "@utils";
import createNewPostForm from "./createNewPostForm";
import createPrayerRequestPost from "./createPrayerRequestPost";
import createTile from "../design-system/createTile";
import { getUserPosts } from "@/js/core/api";
import { authCheck } from "@/js/core/auth";

export default async function userPrayers({ container, user }) {
  const { isOwner, currentUser } = authCheck(user.id);
  const posts = await getUserPosts(user.id);

  /* Prayer Requests Section Header */
  const header = createEl("header");

  const title = createEl("h2", {
    textContent: `${user.profile.preferredName}'s Prayer Requests`,
  });

  const addPostButton = createEl("button", { className: "add-post-btn" });
  const plusIcon = createLucideIcon("Plus");
  addPostButton.append(plusIcon);

  if (isOwner) {
    header.append(addPostButton);
  }

  header.prepend(title);

  /* Prayer Requests Section Body */
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

  posts.forEach((post) => {
    // Creates and appends posts to either closedPosts or openPosts
    createPrayerRequestPost({
      post,
      closedPosts,
      openPosts,
      isOwner,
    });
  });

  closedPostsContainer.append(closedPostsToggle, closedPosts);
  body.push(openPosts, closedPostsContainer);

  /* Compose new post */
  if (header.contains(addPostButton)) {
    // Workaround to get "next" post id
    let nextPostIdNum = getNextPostId(posts);

    addPostButton.addEventListener("click", () => {
      if (document.querySelector(".new-post-form")) return;
      const newPostForm = createNewPostForm({
        currentUser,
        closedPosts,
        openPosts,
        isOwner,
        nextPostIdNum,
        onPostCreated: () => nextPostIdNum++, // For the workaround to get next id
      });
      openPosts.before(newPostForm);
    });
  }

  container.classList.add("tile");

  createTile({ container, header, body });
}
