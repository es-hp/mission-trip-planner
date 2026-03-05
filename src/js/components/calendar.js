import { createEl, createLucideIcon } from "@utils";

export default function calendar(container) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentMonthStr = date.toLocaleString("default", { month: "long" });

  const leftArrowIcon = createLucideIcon("ChevronLeft");
  const rightArrowIcon = createLucideIcon("ChevronRight");
  const leftArrowBtn = createEl("button", { className: "arrow-btn" });
  leftArrowBtn.append(leftArrowIcon);
  const rightArrowBtn = createEl("button", { className: "arrow-btn" });
  rightArrowBtn.append(rightArrowIcon);

  const calendarHeader = createEl("header", { className: "calendar-header" });
  const monthName = createEl("h1", {
    textContent: currentMonthStr.toUpperCase(),
  });

  calendarHeader.append(leftArrowBtn, monthName, rightArrowBtn);

  const calendarBody = createEl("div", { className: "calendar-body" });
  const dayHeaderRow = createEl("div", { className: "day-header-row" });
  const calendarGrid = createEl("div", { className: "calendar-grid" });

  const dayHeaders = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  dayHeaders.forEach((day) => {
    const dayHeader = createEl("div", {
      className: "day-header",
      textContent: day,
    });
    dayHeaderRow.append(dayHeader);
  });

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  console.log(currentMonth);
  console.log(getDaysInMonth(currentYear, currentMonth));

  for (let i = 0; i < 35; i++) {
    const cell = createEl("div", { className: "calendar-cell" });
    calendarGrid.append(cell);
  }

  calendarBody.prepend(dayHeaderRow, calendarGrid);

  container.append(calendarHeader, calendarBody);
}
