import * as lucide from "lucide";
import { Temporal } from "@js-temporal/polyfill";

/* Custom Icon imports */
import prayingHands from "@/icons/praying-hands.svg?raw";

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

const customIcons = {
  prayingHands,
};

export const domParser = new DOMParser();

export const createCustomIcon = (rawSVG) => {
  const doc = domParser.parseFromString(rawSVG, "image/svg+xml");
  return doc.querySelector("svg");
};

export const createCardIcon = (iconName, type = "lucide") => {
  let icon;
  if (type === "lucide") {
    icon = createLucideIcon(iconName);
  } else if (type === "custom") {
    const rawSVG = customIcons[iconName];
    if (!rawSVG) throw new Error(`Custom icon "${iconName}" not found`);
    icon = createCustomIcon(rawSVG);
  }
  const cardIcon = createEl("div", { className: "card-icon" });
  cardIcon.append(icon);
  return cardIcon;
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

export const setupScrollShadows = (wrapper) => {
  const content = wrapper.querySelector(".scroll-content");

  function updateShadows() {
    const { scrollTop, scrollHeight, clientHeight } = content;

    wrapper.classList.toggle("top-shadow", scrollTop > 0);
    wrapper.classList.toggle(
      "bottom-shadow",
      scrollTop + clientHeight < scrollHeight,
    );
  }
  content.addEventListener("scroll", updateShadows);
  updateShadows();
};

export const showInvalidMsg = ({ inputEl, className, message = "error" }) => {
  let messageEl;

  if (inputEl) {
    messageEl = inputEl.nextElementSibling;
  } else if (className) {
    messageEl = document.querySelector(`.${className}`);
  } else {
    return;
  }

  if (!messageEl) return;
  if (!messageEl.classList.contains("invalid-msg")) return;

  messageEl.textContent = message;
  messageEl.classList.remove("hide");
};

export const clearInvalidMsgs = (form) => {
  const messageEls = form.querySelectorAll(".invalid-msg");
  messageEls.forEach((el) => el.classList.add("hide"));
};

export const isEmailValid = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email);
};

/**
 * Formats a date and time for display and use in a <time> element.
 *
 * @param {Temporal.ZonedDateTime | Temporal.Instant | string} dateTime
 *   A Temporal object or ISO 8601 string with offset.
 *   Example: "2025-05-07T12:04:00-04:00[America/New_York]"
 * @param {object} [options]
 * @param {"numeric" | "2-digit" | "short" | "long" | "narrow"} [options.month="numeric"]
 * @param {"numeric" | "2-digit"} [options.day="numeric"]
 * @param {"numeric" | "2-digit"} [options.year="numeric"]
 * @param {"numeric" | "2-digit"} [options.hour="numeric"]
 * @param {"numeric" | "2-digit"} [options.minute="2-digit"]
 * @param {boolean} [options.hour12=true]
 * @returns {{ date: string, time: string, zdtAttribute: string }}
 */
export const formatDateTime = (
  dateTime,
  {
    month = "numeric",
    day = "numeric",
    year = "numeric",
    hour = "numeric",
    minute = "2-digit",
    hour12 = true,
  } = {},
) => {
  const utc = Temporal.Instant.from(dateTime);
  const zdt = utc.toZonedDateTimeISO(Temporal.Now.timeZoneId());
  const date = zdt.toPlainDate().toLocaleString("en-US", {
    month,
    day,
    year,
  });
  const time = zdt.toPlainTime().toLocaleString("en-US", {
    hour,
    minute,
    hour12,
  });
  const zdtAttribute = `${zdt.toPlainDateTime().toString().slice(0, 19)}${zdt.offset}`;

  return { date, time, zdtAttribute };
};

export const resizeTextareaHeight = (textarea) => {
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
};
