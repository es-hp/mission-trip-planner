import { createEl } from "@core/utils";
import { Temporal } from "@js-temporal/polyfill";

export default function userBio({ container, profileUser: user }) {
  const profilePic = createEl("img", {
    className: "profile-pic",
    src: user.profile.avatarURL,
  });
  const profileBio = createEl("section", { className: "profile-bio" });
  const infoWrapper = createEl("div", { className: "bio-info-wrapper" });
  const infoLabels = createEl("div", { className: "bio-info-labels" });
  const infoValues = createEl("div", { className: "bio-info-values" });

  const userName = createEl("h2", {
    className: "bio-user-name",
    textContent: `${user.profile.preferredName} ${user.passport.lastName}`,
  });

  infoWrapper.append(infoLabels, infoValues);
  profileBio.append(userName, infoWrapper);

  const birthday = Temporal.PlainDate.from(
    user.personal.dateOfBirth,
  ).toLocaleString();

  const email = createEl("a", {
    textContent: user.personal.email,
    href: `mailto:${user.personal.email}`,
  });

  const userInfo = {
    email,
    phone: user.personal.phone,
    DOB: birthday,
    "sending church": user.church.site,
  };

  Object.entries(userInfo).forEach(([key, value]) => {
    const label = createEl("span", { textContent: `${key}:` });
    infoLabels.append(label);

    if (value instanceof HTMLElement) {
      infoValues.append(value);
    } else {
      const info = createEl("span", { textContent: value ? value : "" });
      infoValues.append(info);
    }
  });

  container.append(profilePic, profileBio);
}
