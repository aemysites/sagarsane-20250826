/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container (flexbox containing all cards)
  const cardsContainer = element.querySelector('.nv-flexbox');
  if (!cardsContainer) return;

  // Find all card elements
  const cardEls = Array.from(cardsContainer.querySelectorAll('.nv-teaser'));
  if (!cardEls.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards8)']);

  cardEls.forEach(cardEl => {
    // --- IMAGE CELL ---
    const img = cardEl.querySelector('img');
    const imageCell = img || '';

    // --- TEXT CELL ---
    const textContainer = cardEl.querySelector('.general-container-text') || cardEl;
    const textParts = [];

    // 1. Pretitle/category (e.g. 'Featured', 'Manufacturing', etc.)
    const pretitleDiv = textContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitleDiv) {
      Array.from(pretitleDiv.children).forEach(child => {
        textParts.push(child);
      });
    }

    // 2. Title (h3)
    const title = textContainer.querySelector('.cmp-teaser__title');
    if (title) textParts.push(title);

    // 3. Description (customer, products, technologies)
    const desc = textContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.children).forEach(p => {
        textParts.push(p);
      });
    }

    // Compose the text cell as a div (do NOT wrap in anchor)
    const div = document.createElement('div');
    textParts.forEach(part => div.appendChild(part));
    const textCell = div;

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
