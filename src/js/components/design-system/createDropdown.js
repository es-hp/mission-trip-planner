import { createEl } from "@utils";

/**
 * @param {object} params
 * @param {string} params.dropdownName
 * @param {string} params.dropdownId
 * @param {Array<{
 *   value: string,
 *   textContent: string,
 *   disabled: boolean,
 *   selected: boolean
 * }>} optionsArr
 */
export default function createDropdown({
  dropdownName,
  dropdownId,
  optionsArr,
}) {
  if (!Array.isArray(optionsArr)) return;

  const dropdown = createEl("div", { className: "dropdown" });
  const label = createEl("label", { className: "dropdown-label" });
  const select = createEl("select", {
    name: dropdownName,
    id: dropdownId,
    className: "dropdown-select",
  });
  const arrow = createEl("span", {
    textContent: "▾",
    className: "dropdown-arrow",
  });

  optionsArr.forEach((option) => {
    const optionEl = createEl("option", {
      ...option,
      className: "dropdown-option",
    });
    select.append(optionEl);
  });

  label.append(select);
  dropdown.append(label, arrow);
  return { dropdown, select };
}
