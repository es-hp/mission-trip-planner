import { slugify } from "@core/utils";
import trainingCalendar from "@/js/components/schedule/trainingCalendar";
import tripSchedule from "@/js/components/schedule/tripSchedule";

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

  const calendarDiv = document.getElementById("training-calendar");
  if (calendarDiv)
    trainingCalendar({ container: calendarDiv, tripDetails, now });

  const tripScheduleDiv = document.getElementById("trip-schedule");
  if (tripScheduleDiv) {
    await tripSchedule({ container: tripScheduleDiv });
  }

  if (tab && date) {
    const timeEl = document.querySelector(`thead time[datetime="${date}"]`);
    const event = params.get("event");

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
