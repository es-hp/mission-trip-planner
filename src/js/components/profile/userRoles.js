import { createEl } from "@core/utils";
import { authCheck } from "@core/auth";
import createTile from "../design-system/createTile";

export default async function userRoles({ container, profileUser }) {
  const { isOwner, currentUser } = await authCheck(profileUser.id);
  const roles = profileUser.logistics.roles;

  const header = "Roles and Responsibilities";

  const rolesList = createEl("ul", { className: "profile-roles-list" });

  if (roles) {
    roles.forEach((role) => {
      const li = createEl("li", { textContent: `• ${role}` });
      rolesList.append(li);
    });
  }

  const devos = createEl("div", { className: "profile-devos" });
  const devoAssignmentTitle = createEl("h3", {
    textContent: "Leading Team Devo",
  });
  const assignmentDay = createEl("p", {
    textContent: profileUser.logistics.devoAssignment,
  });
  devos.append(devoAssignmentTitle, assignmentDay);

  const body = [rolesList, devos];

  createTile({ container, header, body });
}
