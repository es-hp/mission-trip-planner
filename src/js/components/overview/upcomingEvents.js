import { Temporal } from "@js-temporal/polyfill";
import { createEl } from "../../core/utils";
import createTile from "../design-system/createTile";

export default function upcomingEvents({ container, tripDetails, now }) {
  const content = createEl("ul", { className: "tile-content" });

  const scheduledEvents = tripDetails.trainingSchedule;

  scheduledEvents.forEach((event) => {
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
    content.append(eventCard);
  });

  createTile({ container, title: "Upcoming Events", content });
}
