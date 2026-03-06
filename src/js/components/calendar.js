import { createEl, createLucideIcon } from "@utils";

export default function calendar(container) {
  const currentDate = new Date();
  let selectedDate = new Date(currentDate.getTime());

  /* Build */
  const leftArrowIcon = createLucideIcon("ChevronLeft");
  const rightArrowIcon = createLucideIcon("ChevronRight");
  const leftArrowBtn = createEl("button", { className: "arrow-btn" });
  leftArrowBtn.append(leftArrowIcon);
  const rightArrowBtn = createEl("button", { className: "arrow-btn" });
  rightArrowBtn.append(rightArrowIcon);

  const calendarHeader = createEl("header", { className: "calendar-header" });
  const monthName = createEl("h1");
  const yearText = createEl("h2");
  const monthYear = createEl("div", { className: "month-year" });
  monthYear.append(monthName, yearText);

  const todayBtn = createEl("button", {
    className: "today-btn",
    textContent: "Today",
  });

  const calendarNav = createEl("div", { className: "calendar-nav" });
  calendarNav.append(leftArrowBtn, todayBtn, rightArrowBtn);

  calendarHeader.append(monthYear, calendarNav);

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

  /* Render */
  const updateCalendar = () => {
    calendarGrid.innerHTML = "";

    const selectedMonthStr = selectedDate.toLocaleString("default", {
      month: "long",
    });
    monthName.textContent = selectedMonthStr.toUpperCase();

    yearText.textContent = selectedDate.getFullYear();

    const getDaysInMonth = (date = selectedDate) =>
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    ).getDay();

    let day = 1;

    for (let i = 0; i < 35; i++) {
      const cell = createEl("div", { className: "calendar-cell" });

      if (i >= firstDay && day <= getDaysInMonth()) {
        const calendarDay = createEl("div", {
          className: "calendar-day",
          textContent: day++,
        });
        const todaysDate = new Date();
        if (
          i == todaysDate.getDate() &&
          selectedDate.getMonth() == todaysDate.getMonth()
        ) {
          calendarDay.classList.add("today");
        }
        cell.append(calendarDay);
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

  const goToToday = (date = selectedDate) => {
    selectedDate = new Date();
    updateCalendar();
  };

  rightArrowBtn.addEventListener("click", () => goToNextMonth());
  leftArrowBtn.addEventListener("click", () => goToPrevMonth());
  todayBtn.addEventListener("click", () => goToToday());

  container.append(calendarHeader, calendarBody);
}
