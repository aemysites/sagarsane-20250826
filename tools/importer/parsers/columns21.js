/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns21)'];

  // Defensive: get all immediate child column sets
  const columnSets = Array.from(element.querySelectorAll(':scope > div.page-footer-link-set'));

  // For each column, collect its title and list
  const columns = columnSets.map((colSet) => {
    // Find the title (heading)
    const title = colSet.querySelector('.page-footer-link-set__title');
    // Find the list (ul)
    const list = colSet.querySelector('.page-footer-link-set__links');
    // Compose a column cell: title + list
    const cellContent = [];
    if (title) cellContent.push(title);
    if (list) cellContent.push(list);
    return cellContent;
  });

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
