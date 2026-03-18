import { createEl } from "../../core/utils";
import { Temporal } from "@js-temporal/polyfill";

export default function countdownTimer({
  now,
  departureDateStr,
  returnDateStr,
}) {
  const toTwoDigits = (n) => String(n).padStart(2, "0");
  const actualCurrentTime = Temporal.Now.plainDateTimeISO();

  const departureDate = Temporal.Instant.from(
    departureDateStr,
  ).toZonedDateTimeISO(Temporal.Now.timeZoneId());

  const returnDate = Temporal.Instant.from(returnDateStr).toZonedDateTimeISO(
    Temporal.Now.timeZoneId(),
  );

  const departureCalDate = departureDate.toLocaleString("en-Us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const returnCalDate = returnDate.toLocaleString("en-Us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const countdownDisplay = createEl("div", { className: "countdown-display" });
  const countdownContainer = createEl("div", {
    className: "countdown-container",
  });

  function getCountdownArray(from, to) {
    const countdown = from.until(to, { largestUnit: "month" });
    return [
      { label: "months", value: countdown.months },
      { label: "days", value: countdown.days },
      { label: "hours", value: countdown.hours },
      { label: "mins", value: countdown.minutes },
      { label: "secs", value: countdown.seconds },
    ];
  }

  const countdownArray = getCountdownArray(now, departureDate);

  const updatedValuesMap = {};

  countdownArray.forEach((unit, index, array) => {
    const unitContainer = createEl("div", { className: "unit-container" });
    const unitLabel = createEl("p", {
      className: "unit-label",
      textContent: unit.label,
    });
    const unitDigits = createEl("div", { className: "unit-digits" });
    const unitStr = toTwoDigits(unit.value);

    const first = createEl("div", {
      className: "digit-container",
      textContent: unitStr[0],
    });
    first.style.marginRight = "0.375rem";

    const second = createEl("div", {
      className: "digit-container",
      textContent: unitStr[1],
    });

    updatedValuesMap[unit.label] = { first, second };

    unitDigits.append(first, second);
    unitContainer.append(unitLabel, unitDigits);
    countdownDisplay.append(unitContainer);

    if (index !== array.length - 1) {
      const colon = createEl("div", { className: "colon", textContent: ":" });
      colon.style.margin = "0 0.375rem 0 0.375rem";
      countdownDisplay.append(colon);
    }
  });

  function tick() {
    const realTime = Temporal.Now.plainDateTimeISO();
    const elapsed = actualCurrentTime.until(realTime, {
      largestUnit: "second",
    });
    const currentDateUpdated = now.add(elapsed);

    getCountdownArray(currentDateUpdated, departureDate).forEach(
      ({ label, value }) => {
        const digits = toTwoDigits(value);
        updatedValuesMap[label].first.textContent = digits[0];
        updatedValuesMap[label].second.textContent = digits[1];
      },
    );
  }

  tick();
  setInterval(tick, 1000);

  const tripDates = createEl("div", {
    className: "countdown-trip-dates",
    textContent: `${departureCalDate} ➞ ${returnCalDate}`,
  });

  countdownContainer.append(tripDates, countdownDisplay);

  return countdownContainer;
}
