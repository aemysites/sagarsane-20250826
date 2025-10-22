/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if there are at least 2 child sets (columns)
  const sets = Array.from(element.querySelectorAll(':scope > .page-footer-link-set'));
  if (!sets.length) return;

  // Header row: Block name
  const headerRow = ['Columns (columns21)'];

  // Build columns: each column is a cell in the second row
  const columns = sets.map((set) => {
    // Get the title (heading)
    const title = set.querySelector('.page-footer-link-set__title');
    // Get the list of links
    const links = set.querySelector('.page-footer-link-set__links');
    // Compose a column cell: title + links
    // Defensive: Only include if present
    const cellContent = [];
    if (title) cellContent.push(title);
    if (links) cellContent.push(links);
    return cellContent;
  });

  // Table rows: header + columns row
  const rows = [headerRow, columns];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
