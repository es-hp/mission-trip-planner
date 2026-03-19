import { createEl } from "@utils";
import countdownTimer from "./countdownTimer";

export default async function overviewBanner({ container, tripDetails, now }) {
  const site = tripDetails["site"];
  const flagEmoji = tripDetails["flag"];
  const year = new Date(tripDetails["departureDateTime"]).getFullYear();
  const shortYear = "'" + String(year).slice(-2);

  const subTitle = createEl("h2", { textContent: "Short Term Missions" });

  const tripTitle = createEl("h1", {
    textContent: `${flagEmoji} ${site} ${shortYear}`,
  });

  const description = createEl("p", {
    textContent: tripDetails.description,
    className: "banner-description",
  });

  const heroImgContainer = createEl("div", { className: "hero-img-container" });
  const gradient = createEl("div", { className: "hero-gradient" });
  const heroImg = createEl("img", {
    src: tripDetails.heroImg,
    alt: `Welcome to ${site} short term missions team.`,
    className: "hero-img",
  });

  const countdownContainer = countdownTimer({
    now,
    departureDateStr: tripDetails.departureDateTime,
    returnDateStr: tripDetails.returnDateTime,
  });

  heroImgContainer.append(heroImg, gradient);
  container.append(
    subTitle,
    tripTitle,
    description,
    countdownContainer,
    heroImgContainer,
  );
}
