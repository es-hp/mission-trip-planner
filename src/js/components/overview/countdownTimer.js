import { createEl } from "../../core/utils";
import { Temporal } from "@js-temporal/polyfill";

export default function countdownTimer(departureDateStr) {
  /**
   * NOTE: In production, the 'currentDate' would
   * come from 'Temporal.Now.plainDateTimeISO()'
   * An arbitrary hardcoded past date is used here instead
   * to allow the use of the mock data from 2025.
   */
  const currentDate = Temporal.ZonedDateTime.from({
    year: 2025,
    month: 2,
    day: 1,
    hour: 12,
    minute: 4,
    timeZone: Temporal.Now.timeZoneId(),
  });
  const departureDate = Temporal.Instant.from(
    departureDateStr,
  ).toZonedDateTimeISO(Temporal.Now.timeZoneId());

  const difference = currentDate.until(departureDate, { largestUnit: "month" });

  console.log(difference);
}
