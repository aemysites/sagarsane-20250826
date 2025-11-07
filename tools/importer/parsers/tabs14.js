/* global WebImporter */
export default function parse(element, { document }) {
  // Extract tab labels from desktop navigation
  function getTabLabels() {
    const navList = element.querySelector('.in-page-nav-displayed-list');
    if (!navList) return [];
    return Array.from(navList.querySelectorAll(':scope > li')).map(li => {
      const link = li.querySelector('a');
      return link ? link.textContent.trim() : '';
    }).filter(Boolean);
  }

  // Extract CTA button text
  function getCTAButtonText() {
    const ctaCont = element.querySelector('.ip-nav-cta-cont');
    if (!ctaCont) return '';
    const btnText = ctaCont.querySelector('.btn-text');
    if (btnText) {
      return btnText.textContent.trim();
    }
    const btn = ctaCont.querySelector('a');
    return btn ? btn.textContent.trim() : '';
  }

  // Build table rows
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // Get tab labels
  const tabLabels = getTabLabels();
  // Get CTA button text
  const ctaText = getCTAButtonText();

  // For each tab, create a row: [label, content]
  tabLabels.forEach(label => {
    rows.push([label, '']);
  });

  // Add CTA button as a separate row if present
  if (ctaText) {
    rows.push(['CTA', ctaText]);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
