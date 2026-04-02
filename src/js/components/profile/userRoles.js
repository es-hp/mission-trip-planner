import { createEl } from "@core/utils";
import { authCheck } from "@core/auth";
import createTile from "../design-system/createTile";

export default async function userRoles({ container, profileUser }) {
  // const { isOwner, currentUser } = await authCheck(profileUser.id);
  const roles = profileUser.logistics.roles;

  const header = "Roles";

  const rolesList = createEl("ul", { className: "profile-roles-list" });
  rolesList.style.textTransform = "Capitalize";

  if (roles) {
    roles.forEach((role) => {
      const li = createEl("li", { textContent: `• ${role}` });
      rolesList.append(li);
    });
  }

  const divider = createEl("hr", { className: "post-divider" });

  const devos = createEl("div", { className: "profile-devos" });
  const devoAssignmentTitle = createEl("h2", {
    textContent: "Leading Team Devo",
  });
  const assignmentDay = createEl("p", {
    textContent: profileUser.logistics.devoAssignment,
  });
  devos.append(devoAssignmentTitle, assignmentDay);

  const body = [rolesList, divider, devos];

  createTile({ container, header, body });
}
