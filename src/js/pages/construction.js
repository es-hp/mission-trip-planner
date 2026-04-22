import pageUnderConstruction from "@/js/components/design-system/pageUnderConstruction";

export default function initConstructionPage({ mainID }) {
  const constructionPage = document.querySelector(`.${mainID}-content`);
  if (constructionPage) pageUnderConstruction({ container: constructionPage });
}
