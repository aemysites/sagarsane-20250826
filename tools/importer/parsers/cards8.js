/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card elements by their specific class
  const cardSelector = '.nv-teaser.teaser.nv-teaser--card';
  const cards = Array.from(element.querySelectorAll(cardSelector));

  // Table header row must match the block name exactly
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Reference the actual <img> element from the card
    const img = card.querySelector('img');
    const imageCell = img || '';

    // --- TEXT CELL ---
    // Compose all text content in the correct order
    const textContainer = card.querySelector('.general-container-text');
    const textCellContent = [];
    if (textContainer) {
      // Pre-title/category (may be span, p, or div)
      const pretitle = textContainer.querySelector('.cmp-teaser__pretitle');
      if (pretitle) {
        // Push all child nodes (span, p, etc.) to preserve formatting
        pretitle.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            textCellContent.push(node);
          }
        });
      }
      // Title (h3)
      const title = textContainer.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContent.push(title);
      }
      // Description (customer, products, technologies)
      const description = textContainer.querySelector('.cmp-teaser__description');
      if (description) {
        textCellContent.push(description);
      }
    }
    const textCell = textCellContent.length ? textCellContent : '';
    rows.push([imageCell, textCell]);
  });

  // Create the block table using the correct header
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
