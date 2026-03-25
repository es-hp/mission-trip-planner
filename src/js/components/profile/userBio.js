import { createEl } from "@utils";
import { Temporal } from "@js-temporal/polyfill";

export default function userBio({ container, user }) {
  const profilePic = createEl("img", {
    className: "profile-pic",
    src: user.profile.avatarURL,
  });
  const profileBio = createEl("div", { className: "profile-bio" });
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

  const userInfo = {
    email: user.personal.email,
    phone: user.personal.phone,
    DOB: birthday,
    "sending church":
      user.church.site + user.church.isMember ? " (member)" : null,
  };

  Object.entries(userInfo).forEach(([key, value]) => {
    const label = createEl("span", { textContent: `${key}:` });
    const info = createEl("span", { textContent: value ? value : "" });

    infoLabels.append(label);
    infoValues.append(info);
  });

  container.append(profilePic, profileBio);
}
