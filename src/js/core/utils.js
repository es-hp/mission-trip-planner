import * as lucide from "lucide";

export const createEl = (type, { className, textContent } = {}) => {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

export const addImg = (src, { alt = "", className = "" } = {}) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = className;
  return img;
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
