/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // Find all tab labels (desktop version)
  const navList = element.querySelector('.in-page-nav-displayed-list');
  let tabItems = [];
  if (navList) {
    tabItems = Array.from(navList.querySelectorAll('li'));
  }

  // Find the CTA button (Stay Informed)
  let ctaButton = null;
  const ctaContainer = element.querySelector('.ip-nav-cta-cont');
  if (ctaContainer) {
    ctaButton = ctaContainer.querySelector('a, button');
  }

  // For each tab, add a row: [Tab Label, Tab Content (link HTML)]
  tabItems.forEach((li) => {
    const link = li.querySelector('a');
    let label = '';
    let tabContent = '';
    if (link) {
      label = link.textContent.trim();
      tabContent = link.outerHTML;
    } else {
      label = li.textContent.trim();
      tabContent = '';
    }
    rows.push([label, tabContent]);
  });

  // Add CTA button as its own row at the end, if present
  if (ctaButton) {
    rows.push([ctaButton.textContent.trim(), ctaButton.outerHTML]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
