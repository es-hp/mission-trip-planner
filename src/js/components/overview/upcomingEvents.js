import { Temporal } from "@js-temporal/polyfill";
import { createEl, getCSSVar } from "@utils";
import createTile from "../design-system/createTile";

const accentColor = getCSSVar("--color-accent");

export default function upcomingEvents({ container, tripDetails, now }) {
  const body = createEl("ul", { className: "events-list" });

  const scheduledEvents = tripDetails.trainingSchedule;

  for (const event of scheduledEvents) {
    if (body.children.length >= 5) break;

    const eventCard = createEl("li", { className: "card" });

    const startDateTime = Temporal.PlainDate.from(event.date).toPlainDateTime(
      event.startTime,
    );
    const endDateTime = Temporal.PlainDate.from(event.date).toPlainDateTime(
      event.endTime,
    );
    const startTime = startDateTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const endTime = endDateTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const dateBadge = createEl("div", { className: "event-date-badge" });
    const badgeMonthDay = createEl("div", { className: "event-month-day" });
    const eventDate = createEl("div", {
      className: "event-calendar-date",
      textContent: startDateTime.day,
    });
    const eventDay = createEl("div", {
      className: "event-calendar-day",
      textContent: startDateTime.toLocaleString("en-US", {
        weekday: "short",
      }),
    });
    const eventMonth = createEl("div", {
      className: "event-calendar-month",
      textContent: startDateTime.toLocaleString("en-US", {
        month: "long",
      }),
    });

    badgeMonthDay.append(eventDay, eventMonth);
    dateBadge.append(eventDate, badgeMonthDay);

    const eventDetails = createEl("div", { className: "event-details" });
    const eventTitle = createEl("h3", { textContent: event.title });
    const eventTime = createEl("p", {
      textContent: `${startTime} - ${endTime}`,
    });

    eventDetails.append(eventTitle, eventTime);
    eventCard.append(dateBadge, eventDetails);

    const nowDateTime = now.toPlainDateTime();
    const isHappening =
      Temporal.PlainDateTime.compare(nowDateTime, startDateTime) === 1 &&
      Temporal.PlainDateTime.compare(nowDateTime, endDateTime) === -1;
    const isUpcoming =
      Temporal.PlainDateTime.compare(nowDateTime, startDateTime) === -1;

    if (isHappening) {
      eventCard.style.border = `1px solid ${accentColor}`;
      body.append(eventCard);
    } else if (isUpcoming) {
      body.append(eventCard);
    }
  }

  createTile({ container, header: "Upcoming Events", body });
}
