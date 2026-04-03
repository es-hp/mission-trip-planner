import { createEl, createLucideIcon, getCSSVar } from "@core/utils";
import { getUsers } from "@core/api";
import createTable from "../design-system/createTable";

const successColor = getCSSVar("--color-success");

const MEMBERS_TABLE_TAB_KEY = "members-table-active-tab";

export default async function membersTable({ container, users }) {
  /* Users data normalization */
  const usersData = users.map((user) => {
    const id = user.id.split("_")[1];
    const userProfileHref = `profile.html?userId=${id}`;

    const avatar = createEl("a", { href: userProfileHref });
    const avatarImg = createEl("img", {
      src: user.profile.avatarURL,
      alt: user.profile.preferredName,
      className: "avatar",
      dataset: { pinNopin: "true" },
    });
    avatar.append(avatarImg);

    const userName = createEl("a", {
      href: userProfileHref,
      textContent: `${user.profile.preferredName} ${user.passport.lastName}`,
      className: "table-user",
    });

    const email = createEl("a", {
      textContent: user.personal.email,
      href: `mailto:${user.personal.email}`,
    });

    const [area, prefix, line] = user.personal.phone.split("-");
    const phoneNumber = `(${area}) ${prefix}-${line}`;

    const genderIcon = createLucideIcon("UserRound", {
      size: "1.25rem",
      color: `${user.personal.gender === "male" ? "#87CEEB" : "#FFB6C1"}`,
    });

    const [year, month, day] = user.personal.dateOfBirth.split("-");
    const birthDate = `${month}/${day}/${year}`;

    const roles = createEl("div", { className: "roles-container" });
    user.logistics.roles.forEach((role) => {
      const roleLabel = createEl("div", {
        className: "role-label",
        textContent: role,
      });
      roles.append(roleLabel);
    });

    const rawPercent = user.logistics.fundraisingProgressPercent;
    const fundraisingProgress = createEl("div", { className: "progress-bar" });
    fundraisingProgress.setAttribute("title", `${rawPercent}%`);
    const progress = createEl("div", { className: "progress" });
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

    const senderEmail = createEl("a", {
      textContent: user.church.sender.email,
      href: `mailto:${user.church.sender.email}`,
    });

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

  /* Tab to Visible Data */
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
    fundraisingProgress: "Fundraising %",
    siteAffiliation: "Church & Site",
    membershipStatus: "Membership",
    senderName: "Sender",
    senderEmail: "Sender's Email",
    passportNumber: "Passport Number",
    passportExpiration: "Exp. Date",
  };

  const allKeys = Object.keys(columnsDict);
  const allHeaders = Object.values(columnsDict);
  const allRows = usersData.map((user) =>
    allKeys.map((key) => user[key] ?? "-"),
  );

  /* Build tab navigation bar */
  const tabBar = createEl("div", { className: "tabNav" });
  const table = createTable(allHeaders, allRows, allKeys);
  table.classList.add("members-table");
  container.append(tabBar, table);

  tabs.forEach((tab, index) => {
    const tabButton = createEl("button", {
      className: "tab",
      textContent: tab.tabTitle.toUpperCase(),
    });
    tabBar.append(tabButton);

    tabButton.addEventListener("click", () => {
      tabBar
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tabButton.classList.add("active");
      sessionStorage.setItem(MEMBERS_TABLE_TAB_KEY, index);

      allKeys.forEach((key) => {
        const isIncluded = tab.visibleData.includes(key);
        table.querySelectorAll(`.td-${key}, .th-${key}`).forEach((cell) => {
          cell.style.display = isIncluded ? "table-cell" : "none";
        });
        table.querySelectorAll(`.col-${key}`).forEach((col) => {
          col.style.display = isIncluded ? "table-column" : "none";
        });
      });
    });
  });

  const savedTabIndex = sessionStorage.getItem(MEMBERS_TABLE_TAB_KEY) ?? 0;
  tabBar.children[savedTabIndex].click();
}
