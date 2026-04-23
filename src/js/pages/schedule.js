import { slugify } from "@core/utils";
import trainingCalendar from "@/js/components/schedule/trainingCalendar";
import tripSchedule from "@/js/components/schedule/tripSchedule";
import { Temporal } from "@js-temporal/polyfill";

export default async function initSchedulePage({ tripDetails, now }) {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const date = params.get("date");

  if (tab) {
    const section = document.querySelector(`[data-tab-title="${tab}"]`);
    if (section) {
      const tabNavEl = section.closest(".content").querySelector(".tabNav");
      const instance = tabNavEl?._tabNavInstance;
      instance?.activate(instance.getSectionIndex(tab));
    }
  }

  /* Create Training Calendar Section */
  let initialDate;

  if (tab === "training-schedule" && date) {
    initialDate =
      Temporal.PlainDate.from(date).toZonedDateTime("America/New_York");
  }

  const calendarDiv = document.getElementById("training-calendar");
  if (calendarDiv) {
    trainingCalendar({ container: calendarDiv, tripDetails, now, initialDate });

    if (initialDate) {
      const datetime = Temporal.PlainDateTime.from(date).toString({
        smallestUnit: "minute",
      });

      const calEvent = calendarDiv
        .querySelector(`.time-text time[datetime="${datetime}"]`)
        .closest(".cal-event");

      calEvent?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      const scrollContainer = document.querySelector(".page");

      scrollContainer.addEventListener(
        "scrollend",
        () => {
          calEvent.classList.add("flash");
          calEvent.addEventListener(
            "animationend",
            () => calEvent.classList.remove("flash"),
            { once: true },
          );
        },
        { once: true },
      );
    }
  }

  /* Create Trip Schedule Section */
  const tripScheduleDiv = document.getElementById("trip-schedule");
  if (tripScheduleDiv) {
    await tripSchedule({ container: tripScheduleDiv });

    if (tab === "trip-schedule" && date) {
      const timeEl = document.querySelector(`thead time[datetime="${date}"]`);
      const event = params.get("event");

      console.log(tab, date);

      timeEl?.closest("th")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      if (event) {
        const eventTimeEls = document.querySelectorAll(
          `tbody time[datetime^="${date}"]`,
        );

        const matchedBlock = [...eventTimeEls]
          .find((eventTimeEl) => {
            const title = slugify(
              eventTimeEl.closest(".event-block")?.querySelector(".event-title")
                ?.textContent ?? "",
            );
            return title === event;
          })
          ?.closest(".event-block");

        const scrollContainer = document.getElementById(tab);

        scrollContainer.addEventListener(
          "scrollend",
          () => {
            matchedBlock.classList.add("flash");
            matchedBlock.addEventListener(
              "animationend",
              () => matchedBlock.classList.remove("flash"),
              { once: true },
            );
          },
          { once: true },
        );
      }
    }
  }
}
