/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find the newsfeed block containing the cards
  const newsfeed = element.querySelector('.nv-newsfeed-comp');
  if (!newsfeed) return;

  // Find all card items
  const items = newsfeed.querySelectorAll('.latest-news__item');
  items.forEach((item) => {
    // --- Image cell ---
    let imgCell = null;
    const keyVisual = item.querySelector('.latest-news__item__key-visual');
    if (keyVisual) {
      // Use the <img> directly (do not clone)
      const img = keyVisual.querySelector('img');
      if (img) imgCell = img;
    }

    // --- Text cell ---
    const body = item.querySelector('.latest-news__item__body');
    if (body) {
      // Compose text cell: date, title, description
      // Use elements directly
      const date = body.querySelector('.latest-news__item__body__date');
      const title = body.querySelector('.latest-news__item__body__title');
      const desc = body.querySelector('.latest-news__item__body__description');
      // Compose cell content in order
      const textCell = [];
      if (date) textCell.push(date);
      if (title) textCell.push(title);
      if (desc) textCell.push(desc);
      rows.push([imgCell, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
