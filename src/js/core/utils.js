import * as lucide from "lucide";

export const createEl = (type, props = {}) => {
  const element = document.createElement(type);
  Object.assign(element, props);
  return element;
};

export const createNavLink = (text, href, target = "_self") => {
  const link = document.createElement("a");
  link.href = href;
  link.target = target;

  const span = document.createElement("span");
  span.textContent = text;
  span.className = "link-text";
  link.append(span);

  return link;
};

export const getCSSVar = (varName) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName);

export const ICON_DIM_REM = getCSSVar("--nav-icon-dimension");

export const createLucideIcon = (
  iconName,
  {
    size = ICON_DIM_REM,
    color = "currentColor",
    strokeWidth = 1.5,
    className = "",
  } = {},
) => {
  const icon = lucide[iconName];
  if (!icon) throw new Error(`Lucide icon "${iconName}" not found`);

  const iconSvg = lucide.createElement(icon, {
    width: size,
    height: size,
    color,
    "stroke-width": strokeWidth,
    class: className,
  });

  iconSvg.style.flexShrink = "0";

  return iconSvg;
};

export const formatTo12Hour = (time) => {
  const [h, m] = time.split(":");
  const hour = h % 12 === 0 ? 12 : h % 12;
  const ampm = +h < 12 ? "am" : "pm";
  return m !== "00" ? `${hour}:${m}${ampm}` : `${hour}${ampm}`;
};

export const observeWidth = (element, callback) => {
  const resizeObserver = new ResizeObserver((entries) => {
    callback(entries[0].contentRect.width);
  });
  resizeObserver.observe(element);
};

export const capitalizeText = (text) =>
  text
    .split(/[ -]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
