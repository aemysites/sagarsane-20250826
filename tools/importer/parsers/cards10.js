/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find the parent container for cards
  // Cards are .nv-teaser.teaser.nv-teaser--card
  const cardElements = element.querySelectorAll('.nv-teaser.teaser.nv-teaser--card');

  cardElements.forEach((card) => {
    // Image (first cell)
    const img = card.querySelector('.cmp-image img');
    // Defensive: fallback to null if not found
    const imageCell = img ? img : '';

    // Text content (second cell)
    const textContainer = card.querySelector('.general-container-text');
    let textCellContent = [];
    if (textContainer) {
      // Title
      const title = textContainer.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      // Description (ul)
      const desc = textContainer.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);
      // CTA link
      const cta = textContainer.querySelector('.cmp-teaser__action-link');
      if (cta) textCellContent.push(cta);
    }
    // Defensive: if nothing found, fallback to empty string
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([imageCell, textCellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
