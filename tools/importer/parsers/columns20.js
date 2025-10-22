/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Columns (columns20)'];

  // Find the two columns: image and text content
  // Column 1: image
  const imageCol = element.querySelector('.nv-image img');
  // Column 2: text (heading + description)
  let textCol = null;
  const titleBlock = element.querySelector('.nv-title h2');
  const descBlock = element.querySelector('.nv-text .description');

  // Compose a container for the text column
  if (titleBlock || descBlock) {
    textCol = document.createElement('div');
    if (titleBlock) textCol.appendChild(titleBlock);
    if (descBlock) textCol.appendChild(descBlock);
  }

  // Defensive: if not found, fallback to first h2 and first description
  if (!textCol) {
    const h2 = element.querySelector('h2');
    const desc = element.querySelector('.description');
    if (h2 || desc) {
      textCol = document.createElement('div');
      if (h2) textCol.appendChild(h2);
      if (desc) textCol.appendChild(desc);
    }
  }

  // Defensive: if still not found, fallback to all text
  if (!textCol) {
    textCol = document.createElement('div');
    Array.from(element.querySelectorAll('h2, p')).forEach(el => textCol.appendChild(el));
  }

  // Build the columns row
  const columnsRow = [imageCol, textCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
