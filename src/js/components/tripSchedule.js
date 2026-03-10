import { getTripSchedule } from "../core/api";
import { createEl, getCSSVar } from "@utils";

export default async function tripSchedule(container) {
  const scheduleData = await getTripSchedule();

  const [startYear, startMonth, startDay] = scheduleData[0].date.split("-");
  const [endYear, endMonth, endDay] =
    scheduleData[scheduleData.length - 1].date.split("-");

  const tripStartDate = new Date(startYear, startMonth - 1, startDay);
  const tripEndDate = new Date(endYear, endMonth - 1, endDay);

  const diffInDays = (start, end) =>
    (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
    (1000 * 60 * 60 * 24);

  const tripLength = diffInDays(tripStartDate, tripEndDate) + 1;

  /* Array of formatted dates (MM/DD) */
  const dates = [];
  const cursorDate = new Date(tripStartDate);

  while (cursorDate <= tripEndDate) {
    dates.push({
      date: cursorDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      }),
      day: cursorDate.toLocaleDateString("en-US", { weekday: "short" }),
    });
    cursorDate.setDate(cursorDate.getDate() + 1);
  }

  /* Array of time slots (increment of 30 mins) */
  function generateTimeSlots(start = 7, end = 23) {
    const slots = [];
    for (let h = start; h <= end; h++) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      slots.push(`${hour}:00 ${ampm}`);
      slots.push(`${hour}:30 ${ampm}`);
    }
    return slots;
  }

  /* Tags to Colors */
  const tags = new Set(
    scheduleData.flatMap((dayObj) => dayObj.schedule.map((e) => e.tag)),
  );

  const palette = [
    "rgba(99, 153, 255, 0.375)",
    "rgba(155, 122, 255, 0.375)",
    "rgba(74, 195, 170, 0.375)",
    "rgba(255, 154, 100, 0.375)",
    "rgba(120, 190, 110, 0.375)",
    "rgba(255, 120, 150, 0.375)",
    "rgba(90, 170, 220, 0.375)",
    "rgba(200, 155, 90, 0.375)",
  ];

  const tagColors = {};
  [...tags].forEach((tag, i) => {
    tagColors[tag] = palette[i % palette.length];
  });

  /* Build schedule (table) */
  function createTripTable() {
    const tripTable = createEl("table", { className: "trip-table" });
    const thead = createEl("thead", { className: "trip-table-header" });
    const tbody = createEl("tbody", { className: "trip-table-body" });
    const timeSlots = generateTimeSlots();

    for (let tr = 0; tr < 3; tr++) {
      const hRow = createEl("tr");
      for (let th = 0; th <= tripLength; th++) {
        const hCell = createEl("th");
        if (th === 0) {
          hCell.classList.add("first-col");
        } else {
          if (tr === 0) {
            hCell.textContent = dates[th - 1]?.day || "";
          } else if (tr === 1) {
            hCell.textContent = dates[th - 1]?.date || "";
          } else if (tr === 2) {
            hCell.textContent = scheduleData[th - 1]?.category || "";
          }
        }

        hRow.append(hCell);
      }
      thead.append(hRow);
    }

    const blocked = new Set();
    const timeToRow = {};
    timeSlots.forEach((t, i) => (timeToRow[t] = i));
    const dateToCol = {};
    dates.forEach((d, i) => (dateToCol[d.date] = i + 1));

    const events = {}; // key: "row,col"; value: { event, rowspan }

    scheduleData.forEach((dayObj) => {
      const [, month, day] = dayObj.date.split("-");
      const dateStr = `${month}/${day}`;
      const col = dateToCol[dateStr];
      if (col == null) return;

      dayObj.schedule.forEach(
        ({ start, end, eventTitle, eventDescription, tag }) => {
          const startRow = timeToRow[start];
          const endRow = timeToRow[end];
          if (startRow == null) return;

          const rowspan = (endRow ?? timeSlots.length) - startRow;

          events[`${startRow},${col}`] = {
            eventTitle,
            rowspan,
            start,
            eventDescription,
            tag,
          };

          for (let r = startRow + 1; r < startRow + rowspan; r++) {
            blocked.add(`${r},${col}`);
          }
        },
      );
    });

    timeSlots.forEach((time, index) => {
      const row = createEl("tr", { className: "trip-table-row" });
      for (let td = 0; td <= tripLength; td++) {
        const key = `${index},${td}`;

        if (blocked.has(key)) continue;

        const cell = createEl("td", { className: "td" });
        if (td === 0) {
          cell.classList.add("first-col");
          cell.textContent = time;
        } else if (events[key]) {
          const { eventTitle, rowspan, start, eventDescription, tag } =
            events[key];
          const eventBlock = createEl("div", {
            className: `event-block key${index}${td}`,
          });
          eventBlock.style.backgroundColor = tagColors[tag];
          const title = createEl("p", {
            className: "event-title",
            textContent: eventTitle,
          });
          const startTime = createEl("p", {
            className: "event-time",
            textContent: start,
          });
          const description = createEl("p", {
            className: "event-description",
            textContent: eventDescription,
          });
          cell.rowSpan = rowspan;
          eventBlock.append(title, startTime, description);
          cell.append(eventBlock);
        }
        row.append(cell);
      }
      tbody.append(row);
    });

    tripTable.append(thead, tbody);

    return tripTable;
  }

  const tripTable = createTripTable();

  container.append(tripTable);

  /* Set height for event blocks */
  function setBlockHeight() {
    document.querySelectorAll("td[rowspan] .event-block").forEach((block) => {
      block.style.height = "auto";
    });

    document.querySelectorAll("td[rowspan]").forEach((cell) => {
      const block = cell.querySelector(".event-block");
      if (block && block.offsetHeight < cell.offsetHeight) {
        const cellStyle = getComputedStyle(cell);
        const padding =
          parseFloat(cellStyle.paddingTop) +
          parseFloat(cellStyle.paddingBottom);
        block.style.height = cell.offsetHeight - padding + "px";
      }
    });
  }

  setBlockHeight();

  /* Max size of content to size of table */
  const defaultMaxWidth = getCSSVar("--content-max-width");

  function changeMaxWidth(width) {
    const contentContainer = document.querySelector("#schedule .content");
    const tripScheduleContainer = document.getElementById(
      "trip-schedule-container",
    );
    if (!tripScheduleContainer.classList.contains("hide")) {
      contentContainer.style.maxWidth = width + "px";
    } else {
      contentContainer.style.maxWidth = defaultMaxWidth;
    }
  }

  function observeWidth(element, callback) {
    const resizeObserver = new ResizeObserver((entries) => {
      callback(entries[0].contentRect.width);
    });
    resizeObserver.observe(element);
  }

  const trainingScheduleTab = document.querySelector(
    "#schedule .tabNav button:first-of-type",
  );
  trainingScheduleTab.addEventListener("click", () => {
    observeWidth(tripTable, changeMaxWidth);
  });

  observeWidth(tripTable, changeMaxWidth);
  observeWidth(tripTable, setBlockHeight);
}
