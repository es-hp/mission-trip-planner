import {
  createEl,
  createLucideIcon,
  formatTo12Hour,
  observeWidth,
} from "@core/utils";

export default function createCalendar({
  container,
  data,
  scheduleKey,
  now,
  initialDate,
}) {
  let selectedDate = initialDate ?? now;

  /* Calendar buttons */
  const leftArrowIcon = createLucideIcon("ChevronLeft");
  const rightArrowIcon = createLucideIcon("ChevronRight");
  const leftArrowBtn = createEl("button", { className: "arrow-btn" });
  const rightArrowBtn = createEl("button", { className: "arrow-btn" });
  leftArrowBtn.append(leftArrowIcon);
  rightArrowBtn.append(rightArrowIcon);

  const todayBtn = createEl("button", {
    className: "today-btn",
    textContent: "Today",
  });

  /* Calendar header elments */
  const calendarHeader = createEl("header", { className: "calendar-header" });

  const monthName = createEl("h1");
  const yearText = createEl("h2");
  const calendarNav = createEl("div", { className: "calendar-nav" });

  calendarNav.append(leftArrowBtn, todayBtn, rightArrowBtn);

  calendarHeader.append(yearText, monthName, calendarNav);

  /* Calendar body elements */
  const calendarBody = createEl("div", { className: "calendar-body" });
  const dayHeaderRow = createEl("div", { className: "day-header-row" });
  const calendarGrid = createEl("div", { className: "calendar-grid" });

  const dayHeaders = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  dayHeaders.forEach((day) => {
    const dayHeader = createEl("div", {
      className: "day-header",
      textContent: day,
    });
    dayHeaderRow.append(dayHeader);
  });

  calendarBody.prepend(dayHeaderRow, calendarGrid);

  /* Mount */
  container.append(calendarHeader, calendarBody);

  /* Calendar event data normalization */
  const events = new Map();
  const chipMap = new Map();

  data[scheduleKey].forEach((event) => {
    const key = event.date;

    const formatEventTime = (date, time) => {
      const twelveHr = formatTo12Hour(time);
      const dtRaw = Temporal.PlainDateTime.from(`${date}T${time}`);
      const dtString = dtRaw.toString({ smallestUnit: "minute" });
      return { twelveHr, dtRaw, dtString };
    };

    const start = formatEventTime(event.date, event.startTime);
    const end = formatEventTime(event.date, event.endTime);

    const eventType = event.title
      .toLowerCase()
      .trim()
      .replace(/\s\d+$/, "");

    const chipNum = (chipMap.size % 6) + 1;

    if (!chipMap.has(eventType)) {
      chipMap.set(eventType, `chip-${chipNum}`);
    }

    const eventData = {
      startTime: start.twelveHr,
      endTime: end.twelveHr,
      title: event.title,
      chipColor: chipMap.get(eventType),
      rawStartDt: start.dtRaw,
      dtStart: start.dtString,
      dtEnd: end.dtString,
    };

    const eventsArray = events.get(key) ?? [];
    eventsArray.push(eventData);

    eventsArray.sort((a, b) =>
      Temporal.PlainDateTime.compare(a.rawStartDt, b.rawStartDt),
    );

    events.set(key, eventsArray);
  });

  /* Set cells min height dynamically */
  const setAllCellsMinHeight = () => {
    calendarGrid.querySelectorAll(".calendar-cell").forEach((cell) => {
      cell.style.minHeight = cell.offsetWidth + "px";
    });
  };

  /* Build Calendar */
  const updateCalendar = () => {
    calendarGrid.innerHTML = "";

    const selectedMonthStr = selectedDate.toLocaleString("default", {
      month: "long",
    });
    monthName.textContent = selectedMonthStr.toUpperCase();
    yearText.textContent = String(selectedDate.year);

    const daysInMonth = selectedDate.daysInMonth;
    const firstDay = selectedDate.with({ day: 1 }).dayOfWeek % 7;

    // Create cells
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    let day = 1;

    for (let i = 0; i < totalCells; i++) {
      const cell = createEl("div", { className: "calendar-cell" });

      if (i >= firstDay && day <= daysInMonth) {
        const key = selectedDate.toPlainDate().with({ day }).toString();
        const currentDay = day++;

        const calendarDay = createEl("time", {
          className: "calendar-day",
          textContent: currentDay,
          attributes: { datetime: key },
        });

        cell.classList.add("calendar-valid-days");

        if (
          currentDay == now.day &&
          selectedDate.month == now.month &&
          selectedDate.year == now.year
        ) {
          calendarDay.classList.add("today");
        }

        if (events.has(key) && events.get(key).length > 0) {
          const eventList = events.get(key);
          const eventsContainer = createEl("div", { className: "day-events" });

          eventList.forEach((e) => {
            const { startTime, endTime, title, chipColor, dtStart, dtEnd } = e;
            const event = createEl("div", {
              className: `cal-event ${chipColor} chip-hovers`,
            });

            const timeText = createEl("div", { className: "time-text" });

            const start = createEl("time", {
              textContent: startTime,
              attributes: { datetime: dtStart },
            });

            const end = createEl("time", {
              textContent: endTime,
              attributes: { datetime: dtEnd },
            });

            timeText.append(start, "-", end);

            const titleText = createEl("p", {
              className: "title-text",
              textContent: title,
            });
            event.append(timeText, titleText);
            eventsContainer.append(event);
          });

          cell.append(eventsContainer);
        }
        cell.prepend(calendarDay);
      }
      calendarGrid.append(cell);
    }
    setAllCellsMinHeight();
  };
  updateCalendar();

  /* Handle events */

  // Next & Prev Arrow Button Clicks
  const goToNextMonth = () => {
    selectedDate = selectedDate.add({ months: 1 });
    updateCalendar();
  };

  const goToPrevMonth = () => {
    selectedDate = selectedDate.subtract({ months: 1 });
    updateCalendar();
  };

  const goToToday = () => {
    selectedDate = now;
    updateCalendar();
  };

  rightArrowBtn.addEventListener("click", () => goToNextMonth());
  leftArrowBtn.addEventListener("click", () => goToPrevMonth());
  todayBtn.addEventListener("click", () => goToToday());

  // Dynamically Resize Calendar Cell Heights
  window.addEventListener("resize", setAllCellsMinHeight);

  observeWidth(calendarGrid, setAllCellsMinHeight);
}
