/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, multiple rows
  // 1st row: block name
  // Each subsequent row: [image, text content]

  // Find the cards container
  const cardsContainer = element.querySelector('.general-container.nv-flexbox');
  if (!cardsContainer) return;

  // Select ALL cards (do not slice)
  const cardNodes = Array.from(cardsContainer.querySelectorAll(':scope > .nv-teaser'));

  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards15)']);

  // For each card, extract image and text content
  cardNodes.forEach(card => {
    // 1. Image: find the first img inside the card
    const img = card.querySelector('img');
    if (!img) return;

    // 2. Text content: pretitle and title
    let textContainer = card.querySelector('.general-container-text .nv-card-data') || card.querySelector('.nv-card-data') || card.querySelector('.general-container-text');
    let pretitle, title;
    if (textContainer) {
      pretitle = textContainer.querySelector('.cmp-teaser__pretitle');
      title = textContainer.querySelector('.cmp-teaser__title');
    }

    // Only wrap the title in a link if present, not the whole text block
    const textCell = document.createElement('div');
    if (pretitle) textCell.appendChild(pretitle.cloneNode(true));
    if (title) {
      const link = card.querySelector('a[href]');
      if (link) {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        if (link.target) anchor.target = link.target;
        anchor.appendChild(title.cloneNode(true));
        textCell.appendChild(anchor);
      } else {
        textCell.appendChild(title.cloneNode(true));
      }
    }

    rows.push([img, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
