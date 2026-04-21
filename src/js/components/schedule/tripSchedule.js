import { getTripSchedule } from "@core/api";
import { createEl, createChipColorMap, observeWidth } from "@core/utils";
import { Temporal } from "@js-temporal/polyfill";

export default async function tripSchedule(container) {
  const scheduleData = await getTripSchedule();

  const lastDayIndex = scheduleData.length - 1;
  const lastEventIndex = scheduleData[lastDayIndex].schedule.length - 1;

  const tripStartZdt = Temporal.PlainDateTime.from(
    `${scheduleData[0].date}T${scheduleData[0].schedule[0].start}`,
  ).toZonedDateTime("America/New_York");

  const tripStartDt = tripStartZdt.toPlainDate();

  const tripEndZdt = Temporal.PlainDateTime.from(
    `${scheduleData[lastDayIndex].date}T${scheduleData[lastDayIndex].schedule[lastEventIndex].start}`,
  ).toZonedDateTime("America/New_York");

  const tripEndDt = tripEndZdt.toPlainDate();

  const tripLength =
    tripStartDt.until(tripEndDt, { largestUnit: "day" }).days + 1;

  // Format time utility fn
  const toFormattedTimeStr = (time, { twelveHr = false } = {}) => {
    return Temporal.PlainTime.from(time).toLocaleString("en-US", {
      hour: twelveHr ? "numeric" : "2-digit",
      minute: "2-digit",
      hour12: twelveHr,
    });
  };

  /* Build Schedule (table) */
  const tripTable = createEl("table", { className: "trip-table" });
  const thead = createEl("thead", { className: "trip-table-header" });
  const tbody = createEl("tbody", {
    className: "trip-table-body no-table-hover",
  });

  /* Array of Column Data (To derive Map from) */
  const dataForColumns = [];
  let tripDayDt = tripStartDt;
  let colIdx = 1;

  while (Temporal.PlainDateTime.compare(tripDayDt, tripEndDt) <= 0) {
    const tripDateStr = tripDayDt.toString();
    const match = scheduleData.find((date) => date.date === tripDateStr);

    const colData = {
      colIdx,
      shortDate: `${tripDayDt.month}/${tripDayDt.day}`,
      shortDay: tripDayDt.toLocaleString("en-US", { weekday: "short" }),
      category: match?.category ?? "",
      eventsArr: match?.schedule ?? [],
    };

    const column = [tripDateStr, colData];
    dataForColumns.push(column);

    colIdx++;
    tripDayDt = tripDayDt.add({ days: 1 });
  }

  /* Build Table Head */
  const colDataByDate = new Map(dataForColumns);

  for (let tr = 0; tr < 3; tr++) {
    const headerRow = createEl("tr");
    for (let colIndex = 0; colIndex <= tripLength; colIndex++) {
      const headerCell = createEl("th");
      if (colIndex === 0) {
        headerCell.classList.add("first-col");
      } else {
        const tripDateStr = tripStartDt.add({ days: colIndex - 1 }).toString();

        const data = colDataByDate.get(tripDateStr);

        if (tr === 0) {
          headerCell.textContent = data.shortDay || "";
        } else if (tr === 1) {
          headerCell.textContent = data.shortDate || "";
        } else if (tr === 2) {
          headerCell.textContent = data.category || "";
        }
      }
      headerRow.append(headerCell);
    }
    thead.append(headerRow);
  }

  /* Map First Column Data: {Time (30 min increments) => Row Index} */
  const rowByTime = new Map();
  let rowIndex = 0;

  for (let h = 7; h <= 23; h++) {
    const wholeHr = toFormattedTimeStr({ hour: h, minute: 0 });
    const halfHr = toFormattedTimeStr({ hour: h, minute: 30 });

    rowByTime.set(wholeHr, rowIndex);
    rowByTime.set(halfHr, rowIndex + 1);

    rowIndex += 2;
  }

  /* Map Events By Date */
  const eventsByDate = new Map();
  const { chipMap, addChip } = createChipColorMap();
  const blockedCells = new Set();

  dataForColumns.forEach(([date, data]) => {
    const colEvents = [];

    data.eventsArr.forEach((event) => {
      const startTime24 = toFormattedTimeStr(event.start);
      const endTime24 = toFormattedTimeStr(event.end);

      const colIdx = data.colIdx;
      const startRowIdx = rowByTime.get(startTime24);
      const rowspan =
        (rowByTime.get(endTime24) ?? [...rowByTime.values()].at(-1)) -
        startRowIdx;

      addChip(event.tag);

      const eventsData = {
        startTime24,
        endTime24,
        colIdx,
        startRowIdx,
        rowspan,
        title: event.eventTitle,
        description: event.eventDescription,
        chipColor: chipMap.get(event.tag),
      };

      colEvents.push(eventsData);

      for (let row = startRowIdx + 1; row < startRowIdx + rowspan; row++) {
        blockedCells.add(`${colIdx},${row}`);
      }
    });

    eventsByDate.set(date, colEvents);
  });

  /* Build Table Body */
  for (const [time, rowIndex] of rowByTime) {
    const row = createEl("tr", { className: "trip-table-row" });

    for (let colIndex = 0; colIndex <= tripLength; colIndex++) {
      const blockedKey = `${colIndex},${rowIndex}`;
      if (blockedCells.has(blockedKey)) continue;

      const cell = createEl("td");

      if (colIndex === 0) {
        cell.classList.add("first-col");
        const time12Hr = toFormattedTimeStr(time, { twelveHr: true });
        const timeEl = createEl("time", {
          textContent: time12Hr,
          attributes: { datetime: time },
        });
        cell.append(timeEl);
      } else {
        const date = dataForColumns[colIndex - 1][0];
        const colEvents = eventsByDate.get(date) ?? [];

        if (colEvents.length > 0) {
          for (const event of colEvents) {
            if (event.startRowIdx === rowIndex) {
              const eventBlock = createEl("div", {
                className: `event-block ${event.chipColor}`,
              });

              const title = createEl("header", {
                className: "event-title",
                textContent: event.title,
              });

              const time = createEl("div", { className: "event-time" });

              const startTime12 = createEl("time", {
                textContent: toFormattedTimeStr(event.startTime24, {
                  twelveHr: true,
                }),
                attributes: {
                  datetime: `${date}T${toFormattedTimeStr(event.startTime24)}`,
                },
              });
              const endTime12 = createEl("time", {
                textContent: toFormattedTimeStr(event.endTime24, {
                  twelveHr: true,
                }),
                attributes: {
                  datetime: `${date}T${toFormattedTimeStr(event.endTime24)}`,
                },
              });

              time.append(startTime12, "-", endTime12);

              const description = createEl("p", {
                className: "event-description",
                textContent: event.description,
              });

              cell.rowSpan = event.rowspan;

              eventBlock.append(title, time, description);
              cell.append(eventBlock);
            }
          }
        }
      }
      row.append(cell);
    }
    tbody.append(row);
  }
  tripTable.append(thead, tbody);
  container.append(tripTable);

  /* Set height for event blocks */
  function setBlockHeight() {
    document.querySelectorAll("td[rowspan]").forEach((cell) => {
      const block = cell.querySelector(".event-block");
      if (!block) return;

      const cellStyle = getComputedStyle(cell);
      const paddingTop = parseFloat(cellStyle.paddingTop);
      const paddingBottom = parseFloat(cellStyle.paddingBottom);
      const cellHeightNoPadding =
        cell.clientHeight - paddingTop - paddingBottom;

      if (block.offsetHeight < cellHeightNoPadding) {
        block.style.height = `${cellHeightNoPadding}px`;
      }
    });
  }

  requestAnimationFrame(() => {
    setBlockHeight();
  });

  observeWidth(tripTable, setBlockHeight);
}
