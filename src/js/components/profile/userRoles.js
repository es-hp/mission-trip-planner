import { createEl } from "@core/utils";
import { authCheck } from "@core/auth";
import createTile from "../design-system/createTile";
import { Temporal } from "@js-temporal/polyfill";

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

  const devoZDT = Temporal.Instant.from(
    profileUser.logistics.devoAssignment,
  ).toZonedDateTimeISO("America/New_York");

  const devoDateStr = devoZDT.toPlainDate().toString();

  const devoDate = devoZDT.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });

  const devos = createEl("div", { className: "profile-devos" });
  const devoAssignmentTitle = createEl("h2", {
    textContent: "Leading Team Devo",
  });
  const assignmentDay = createEl("a", {
    textContent: devoDate,
    href: `schedules.html?tab=trip-schedule&date=${devoDateStr}&event=morning-devo`,
  });
  devos.append(devoAssignmentTitle, assignmentDay);

  const body = [rolesList, divider, devos];

  createTile({ container, header, body });
}
