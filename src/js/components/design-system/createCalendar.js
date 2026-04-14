import {
  createEl,
  createLucideIcon,
  formatTo12Hour,
  observeWidth,
} from "@core/utils";

export default function createCalendar({ container, data, scheduleKey, now }) {
  let selectedDate = now;

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
  const events = {};
  const chipMap = new Map();

  data[scheduleKey].forEach((event) => {
    const [year, month, day] = event.date.split("-");
    const eventStart = formatTo12Hour(event.startTime);
    const eventEnd = formatTo12Hour(event.endTime);

    const eventType = event.title
      .toLowerCase()
      .trim()
      .replace(/\s\d+$/, "");

    const chipNum = (chipMap.size % 6) + 1;

    if (!chipMap.has(eventType)) {
      chipMap.set(eventType, `chip-${chipNum}`);
    }

    events[`${year}, ${parseInt(month)}, ${parseInt(day)}`] = {
      time: `${eventStart}-${eventEnd}`,
      title: event.title,
      chipColor: chipMap.get(eventType),
    };
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
      const key = `${selectedDate.year}, ${selectedDate.month}, ${day}`;

      if (i >= firstDay && day <= daysInMonth) {
        const currentDay = day++;
        const calendarDay = createEl("div", {
          className: "calendar-day",
          textContent: currentDay,
        });

        cell.classList.add("calendar-valid-days");

        if (
          currentDay == now.day &&
          selectedDate.month == now.month &&
          selectedDate.year == now.year
        ) {
          calendarDay.classList.add("today");
        }

        if (events[key]) {
          const { time, title, chipColor } = events[key];
          const event = createEl("div", {
            className: `cal-event ${chipColor} chip-hovers`,
          });
          const timeText = createEl("p", {
            className: "time-text",
            textContent: time,
          });
          const titleText = createEl("p", {
            className: "title-text",
            textContent: title,
          });
          event.append(timeText, titleText);
          cell.append(event);
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
