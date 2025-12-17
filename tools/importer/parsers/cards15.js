/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, each row is a card with image/icon and text

  // Header row
  const headerRow = ['Cards (cards15)'];

  // Find the parent container holding all cards
  const cardContainer = element.querySelector('.general-container.nv-flexbox');
  if (!cardContainer) return;

  // Find all card elements inside the container
  const cardEls = Array.from(cardContainer.querySelectorAll('.nv-teaser'));

  // Helper to extract image from card
  function getCardImage(card) {
    const img = card.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from card
  function getCardText(card) {
    // Find the pretitle (category)
    const pretitle = card.querySelector('.cmp-teaser__pretitle');
    // Find the main title (headline)
    const title = card.querySelector('.cmp-teaser__title');
    // Find the link
    const link = card.querySelector('a[href]');
    // Compose a fragment for text cell
    let frag;
    if (link) {
      frag = document.createElement('a');
      frag.href = link.href;
      frag.target = link.target || '_self';
    } else {
      frag = document.createElement('div');
    }
    if (pretitle) {
      const pretitleDiv = document.createElement('div');
      pretitleDiv.textContent = pretitle.textContent;
      frag.append(pretitleDiv);
    }
    if (title) {
      const titleDiv = document.createElement('div');
      titleDiv.textContent = title.textContent;
      frag.append(titleDiv);
    }
    return frag;
  }

  // Build rows for each card
  const rows = cardEls.map(card => {
    const img = getCardImage(card);
    const text = getCardText(card);
    return [img, text];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
