/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns5)'];

  // Get all immediate child column blocks
  const columns = Array.from(element.querySelectorAll(':scope > div.page-footer-link-set'));

  // Defensive: If no columns found, do nothing
  if (!columns.length) return;

  // Each column cell will contain the title and its list of links
  const columnCells = columns.map((col) => {
    // Find the title
    const title = col.querySelector('.page-footer-link-set__title');
    // Find the list
    const list = col.querySelector('.page-footer-link-set__links');
    // Defensive: If missing, fallback to all children
    const cellContent = [];
    if (title) cellContent.push(title);
    if (list) cellContent.push(list);
    // Return as an array of elements for the cell
    return cellContent;
  });

  // Build the table rows
  const rows = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
