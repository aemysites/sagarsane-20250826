/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages19) block: 1 column, multiple rows, each row is a card (title, description, CTA)
  const headerRow = ['Cards (cardsNoImages19)'];
  const rows = [headerRow];

  // Extract left column: heading and paragraphs as a card
  const leftTitle = element.querySelector('.nv-title .title');
  const leftDesc = element.querySelector('.nv-text .description');
  if (leftTitle || leftDesc) {
    const leftCell = [];
    if (leftTitle) leftCell.push(leftTitle.cloneNode(true));
    if (leftDesc) {
      // Get all paragraphs in the description
      const paragraphs = leftDesc.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent.trim() || p.querySelector('a')) leftCell.push(p.cloneNode(true));
      });
    }
    rows.push([leftCell]);
  }

  // Extract actual cards from the right column
  const cardContainers = element.querySelectorAll('.nv-teaser.teaser.nv-teaser--card');
  cardContainers.forEach(card => {
    const cellContent = [];
    // Title
    const titleEl = card.querySelector('.cmp-teaser__title');
    if (titleEl) cellContent.push(titleEl.cloneNode(true));
    // Description
    const descEl = card.querySelector('.cmp-teaser__description');
    if (descEl) cellContent.push(descEl.cloneNode(true));
    // CTA links
    const ctaContainer = card.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const links = Array.from(ctaContainer.querySelectorAll('a')).filter(a => a.href);
      links.forEach(link => cellContent.push(link.cloneNode(true)));
    }
    rows.push([cellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
