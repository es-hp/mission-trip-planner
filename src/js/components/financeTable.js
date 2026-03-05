import createTable from "./table";

export default function financeTable(container) {
  const headers = ["Monday", "Tuesday", "Wednesday", "Thursday"];
  const rows = [
    ["asd", "asd", "asd", "asd"],
    ["asd", "asd", "asd", "asd"],
    ["asd", "asd", "asd", "asd"],
  ];
  const keys = ["mon", "tues", "wed", "thurs"];

  const table = createTable(headers, rows, keys);
  table.classList.add("members-table");
  table.classList.add("finance-table");

  container.append(table);
}
