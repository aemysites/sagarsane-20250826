/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block: 2 columns, multiple rows (image | text)
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // The cards are .nv-teaser.teaser.nv-teaser--card
  const cardNodes = element.querySelectorAll('.nv-teaser.teaser.nv-teaser--card');

  cardNodes.forEach((card) => {
    // --- IMAGE COLUMN ---
    // Find the image inside the card
    const img = card.querySelector('img');
    // Defensive: use the actual <img> element if present, else null
    const imgEl = img || '';

    // --- TEXT COLUMN ---
    // Container for text content
    const textCol = document.createElement('div');

    // Title (h3)
    const title = card.querySelector('.cmp-teaser__title');
    if (title) {
      textCol.appendChild(title);
    }

    // Description (ul or .cmp-teaser__description)
    const desc = card.querySelector('.cmp-teaser__description');
    if (desc) {
      textCol.appendChild(desc);
    }

    // CTA (link)
    const cta = card.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCol.appendChild(cta);
    }

    rows.push([imgEl, textCol]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
