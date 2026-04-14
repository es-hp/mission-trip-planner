import { createEl, slugify } from "@core/utils";

class TabNav {
  constructor(nav, key) {
    this.nav = nav;
    this.key = key;
    this.sections = this.#discoverSections();
    this.tabs = [];

    if (this.sections.length === 0) {
      console.warn("TabNav: no [data-tab-title] secions to create nav", nav);
      return;
    }

    this.#buildTabs();
    this.#activate(this.#savedIndex());
  }

  #discoverSections() {
    const contentDiv = this.nav.closest(".content");
    return [...contentDiv.querySelectorAll(":scope > section[data-tab-title]")];
  }

  #buildTabs() {
    this.sections.forEach((section, index) => {
      if (!section.id)
        section.id = slugify(section.dataset.tabTitle) + "-section";

      section.setAttribute("role", "tabpanel");

      const tab = createEl("button", {
        type: "button",
        id: `tab-${this.key}-${index}`,
        textContent: section.dataset.tabTitle,
        className: "tab",
        setAttribute: { role: "tab" },
      });

      tab.addEventListener("click", () => this.#activate(index));

      this.nav.append(tab);
      this.tabs.push(tab);
    });

    this.nav.setAttribute("role", "tablist");
  }

  #savedIndex() {
    const saved = sessionStorage.getItem(this.key);
    const index = parseInt(saved, 10);
    return Number.isFinite(index) && index >= 0 && index < this.sections.length
      ? index
      : 0;
  }

  #activate(index) {
    this.sections.forEach((section, i) => {
      const isActive = i === index;
      section.hidden = !isActive;
      this.tabs[i].classList.toggle("active", isActive);
    });

    sessionStorage.setItem(this.key, String(index));
  }
}

export function initTabNav() {
  const navs = document.querySelectorAll("nav.tabNav");

  navs.forEach((nav, navIndex) => {
    const key = `tabNav-${location.pathname}-${navIndex}`;
    new TabNav(nav, key);
  });
}
