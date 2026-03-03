import { getUsers } from "../core/api";
import createTable from "./table";
import {
  addImg,
  createNavLink,
  createLucideIcon,
  getCSSVar,
} from "../core/utils";

const successColor = getCSSVar("--color-success");

export default async function participantsTable(container) {
  const users = await getUsers();

  const usersData = users.map((user) => {
    const avatar = addImg(
      user.profile.avatarURL,
      user.profile.preferredName,
      "avatar",
    );

    const userName = `${user.profile.preferredName} ${user.passport.lastName}`;

    const email = createNavLink(
      user.personal.email,
      `mailto:${user.personal.email}`,
      "_blank",
    );

    const [area, prefix, line] = user.personal.phone.split("-");
    const phoneNumber = `(${area}) ${prefix}-${line}`;

    const genderIcon = createLucideIcon("UserRound", {
      size: "1.25rem",
      color: `${user.personal.gender === "male" ? "#87CEEB" : "#FFB6C1"}`,
    });

    const [year, month, day] = user.personal.dateOfBirth.split("-");
    const birthDate = `${month}/${day}/${year}`;

    const roles = document.createElement("div");
    roles.classList.add("roles-container");
    user.logistics.roles.forEach((role) => {
      const roleLabel = document.createElement("div");
      roleLabel.className = "role-label";
      roleLabel.textContent = role;
      roles.append(roleLabel);
    });

    const rawPercent = user.logistics.fundraisingProgressPercent;
    const fundraisingProgress = document.createElement("div");
    fundraisingProgress.className = "progress-bar";
    fundraisingProgress.setAttribute("title", `${rawPercent}%`);
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.setProperty("width", `${rawPercent}%`);
    progress.classList.add(
      rawPercent < 33.33
        ? "low"
        : rawPercent < 66.66
          ? "med"
          : rawPercent < 100
            ? "high"
            : "done",
    );
    fundraisingProgress.append(progress);

    const membershipStatus = createLucideIcon("BadgeCheck", {
      size: "1rem",
      color: successColor,
    });

    const senderEmail = createNavLink(
      user.church.sender.email,
      `mailto:${user.church.sender.email}`,
      "_blank",
    );

    return {
      avatar,
      userName,
      email,
      phoneNumber,
      genderIcon,
      birthDate,
      roles,
      shirtSize: user.logistics.shirtSize,
      devotional: user.logistics.devoAssignment,
      fundraisingProgress,
      siteAffiliation: user.church.site,
      membershipStatus,
      senderName: user.church.sender.name,
      senderEmail,
    };
  });

  const tabs = [
    {
      tabTitle: "Member Details",
      visibleData: [
        "avatar",
        "userName",
        "email",
        "phoneNumber",
        "genderIcon",
        "birthDate",
      ],
    },
    {
      tabTitle: "Member Logistics",
      visibleData: [
        "avatar",
        "userName",
        "roles",
        "shirtSize",
        "devotional",
        "fundraisingProgress",
      ],
    },
    {
      tabTitle: "Church Membership",
      visibleData: [
        "avatar",
        "userName",
        "siteAffiliation",
        "membershipStatus",
        "senderName",
        "senderEmail",
      ],
    },
  ];

  // if (currentUser.isAdmin) {
  //   tabs.push({
  //     tabTitle: "Passport",
  //     visibleData: [
  //       "avatar",
  //       "legalName",
  //       "nationality",
  //       "passportNumber",
  //       "expirationDate",
  //     ],
  //   });
  // }

  const columnsDict = {
    avatar: "",
    userName: "Name",
    email: "Email",
    phoneNumber: "Phone",
    genderIcon: "Gender",
    birthDate: "DOB",
    roles: "Roles & Teams",
    shirtSize: "Shirt Size",
    devotional: "Leading Devo",
    fundraisingProgress: "Fundraising Progress",
    siteAffiliation: "Church/Site Affiliation",
    membershipStatus: "Membership Status",
    senderName: "Sender",
    senderEmail: "Sender's Email",
    passportNumber: "Passport Number",
    passportExpiration: "Expiration Date",
  };

  const getheaders = (tab) => {
    return tab.visibleData.map((key) => columnsDict[key] ?? "");
  };

  const getrows = (tab) => {
    return usersData.map((user) =>
      tab.visibleData.map((key) => user[key] ?? ""),
    );
  };

  const tabBar = document.createElement("div");
  container.append(tabBar);

  tabs.forEach((tab) => {
    const tabButton = document.createElement("button");
    tabButton.classList.add("tab");
    tabButton.textContent = tab.tabTitle.toUpperCase();

    tabButton.addEventListener("click", () => {
      tabBar
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tabButton.classList.add("active");

      const headers = getheaders(tab);
      const rows = getrows(tab);

      const oldTable = container.querySelector("table");
      if (oldTable) oldTable.remove();

      const table = createTable(headers, rows);
      container.append(table);
    });

    tabBar.append(tabButton);
  });

  if (tabBar.firstChild) tabBar.firstChild.click();

  container.append(test);
}
