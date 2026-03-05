import { createEl } from "@utils";

export default function createTable(headers, rows, keys) {
  const tableWrapper = createEl("div", { className: "table-wrapper" });
  const table = createEl("table");
  const colgroup = createEl("colgroup");
  const thead = createEl("thead");
  const tbody = createEl("tbody");
  const headerRow = createEl("tr");

  headers.forEach((header, colIndex) => {
    const key = keys?.[colIndex];

    const col = createEl("col", {
      className: `col-${colIndex + 1} col-${key}`,
    });
    colgroup.append(col);

    const th = createEl("th", {
      textContent: header,
      className: `th-${colIndex + 1} th-${key}`,
    });
    headerRow.append(th);
  });
  thead.append(headerRow);

  rows.forEach((row) => {
    const tr = createEl("tr");

    row.forEach((value, colIndex) => {
      const key = keys?.[colIndex] ?? colIndex;
      const td = createEl("td", { className: `td-${colIndex + 1} td-${key}` });

      if (value instanceof Node) {
        td.append(value);
      } else {
        td.textContent = value;
      }
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(colgroup, thead, tbody);
  tableWrapper.append(table);

  return tableWrapper;
}
