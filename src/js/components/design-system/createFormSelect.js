import { createEl } from "@core/utils";

/**
 * @param {object} params
 * @param {string} params.formSelectName
 * @param {string} params.formSelectId
 * @param {Array<{
 *   value: string,
 *   textContent: string,
 *   disabled: boolean,
 *   selected: boolean
 * }>} optionsArr
 */
export default function createFormSelect({
  formSelectName,
  formSelectId,
  optionsArr,
}) {
  if (!Array.isArray(optionsArr)) return;

  const label = createEl("label", { className: "select-label" });
  const select = createEl("select", {
    name: formSelectName,
    id: formSelectId,
    className: "form-select",
  });
  const arrow = createEl("span", {
    textContent: "▾",
    className: "select-down-arrow",
  });

  arrow.addEventListener("click", () => select.click());

  optionsArr.forEach((option) => {
    const optionEl = createEl("option", {
      ...option,
      className: "select-option",
    });
    select.append(optionEl);
  });

  label.append(select);
  return { label, select };
}
