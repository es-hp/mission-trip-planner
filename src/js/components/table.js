export default function createTable(headers, rows, keys) {
  const tableWrapper = document.createElement("div");
  const table = document.createElement("table");
  const colgroup = document.createElement("colgroup");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  headers.forEach((header, colIndex) => {
    const key = keys?.[colIndex];

    const col = document.createElement("col");
    col.classList.add(`col-${colIndex + 1}`);
    col.classList.add(`col-${key}`);
    colgroup.append(col);

    const th = document.createElement("th");
    th.textContent = header;
    th.classList.add(`th-${colIndex + 1}`);
    th.classList.add(`th-${key}`);
    headerRow.append(th);
  });
  thead.append(headerRow);

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    row.forEach((value, colIndex) => {
      const key = keys?.[colIndex] ?? colIndex;
      const td = document.createElement("td");

      if (value instanceof Node) {
        td.append(value);
      } else {
        td.textContent = value;
      }
      td.classList.add(`td-${colIndex + 1}`);
      td.classList.add(`td-${key}`);
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(colgroup, thead, tbody);

  tableWrapper.classList.add("table-wrapper");
  tableWrapper.append(table);

  return tableWrapper;
}
