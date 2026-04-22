import userBio from "@/js/components/profile/userBio";
import userPrayers from "@/js/components/profile/userPrayers";
import userRoles from "@/js/components/profile/userRoles";

export default async function initProfilePage({ getUserById }) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("userId");
  const profileUser = await getUserById(`user_${id}`);

  const bioDiv = document.querySelector(".user-bio");
  if (bioDiv) userBio({ container: bioDiv, profileUser });

  const prayersDiv = document.querySelector(".user-prayers");
  if (prayersDiv) userPrayers({ container: prayersDiv, profileUser });

  const userRolesDiv = document.querySelector(".user-roles");
  if (userRolesDiv) userRoles({ container: userRolesDiv, profileUser });
}
