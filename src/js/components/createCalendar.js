import { createEl, createLucideIcon, formatTo12Hour } from "@utils";

export default function createCalendar(container, data, scheduleKey) {
  /* State */
  const currentDate = new Date();
  let selectedDate = new Date(currentDate.getTime());

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
  const monthYear = createEl("div", { className: "month-year" });
  monthYear.append(monthName, yearText);

  const calendarNav = createEl("div", { className: "calendar-nav" });
  calendarNav.append(leftArrowBtn, todayBtn, rightArrowBtn);

  calendarHeader.append(monthYear, calendarNav);

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

  /* Calendar event data normalization */
  const events = {};

  data[scheduleKey].forEach((event) => {
    const [year, month, day] = event.date.split("-");
    const eventStart = formatTo12Hour(event.startTime);
    const eventEnd = formatTo12Hour(event.endTime);
    events[`${year}, ${parseInt(month)}, ${parseInt(day)}`] = {
      time: `${eventStart}-${eventEnd}`,
      title: event.title,
    };
  });

  /* Build Calendar */
  const updateCalendar = () => {
    calendarGrid.innerHTML = "";

    const selectedMonthStr = selectedDate.toLocaleString("default", {
      month: "long",
    });
    monthName.textContent = selectedMonthStr.toUpperCase();

    yearText.textContent = selectedDate.getFullYear();

    const getDaysInMonth = (date = selectedDate) =>
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysInMonth = getDaysInMonth();

    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    ).getDay();

    // Create cells
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    let day = 1;

    for (let i = 0; i < totalCells; i++) {
      const cell = createEl("div", { className: "calendar-cell" });

      const key = `${selectedDate.getFullYear()}, ${selectedDate.getMonth() + 1}, ${day}`;

      if (i >= firstDay && day <= daysInMonth) {
        const calendarDay = createEl("div", {
          className: "calendar-day",
          textContent: day++,
        });
        const todaysDate = new Date();
        if (
          i == todaysDate.getDate() &&
          selectedDate.getMonth() == todaysDate.getMonth() &&
          selectedDate.getFullYear() == todaysDate.getFullYear()
        ) {
          calendarDay.classList.add("today");
        }

        if (events[key]) {
          const { time, title } = events[key];
          const event = createEl("div", { className: "cal-event" });
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
  };

  updateCalendar();

  /* Handle events */

  const goToNextMonth = (date = selectedDate) => {
    if (date.getMonth() === 11) {
      date.setMonth(0);
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    updateCalendar();
  };

  const goToPrevMonth = (date = selectedDate) => {
    if (date.getMonth() === 0) {
      date.setMonth(11);
      date.setFullYear(date.getFullYear() - 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    updateCalendar();
  };

  const goToToday = () => {
    selectedDate = new Date();
    updateCalendar();
  };

  rightArrowBtn.addEventListener("click", () => goToNextMonth());
  leftArrowBtn.addEventListener("click", () => goToPrevMonth());
  todayBtn.addEventListener("click", () => goToToday());

  container.append(calendarHeader, calendarBody);
}
