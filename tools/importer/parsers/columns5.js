/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as header row
  const headerRow = ['Columns (columns5)'];

  // Get all immediate child column sets
  const columns = Array.from(element.querySelectorAll(':scope > .page-footer-link-set'));

  // Defensive: Only proceed if columns found
  if (!columns.length) return;

  // Only use actual columns present, do not pad with empty cells
  const cells = columns.map(col => {
    // Find the title
    const title = col.querySelector('.page-footer-link-set__title');
    // Find the list
    const list = col.querySelector('.page-footer-link-set__links');
    // Defensive: If either missing, skip
    if (!title || !list) return null;
    // Clone nodes to avoid moving them from the DOM
    const titleClone = title.cloneNode(true);
    const listClone = list.cloneNode(true);
    // Wrap both in a fragment
    const fragment = document.createDocumentFragment();
    fragment.appendChild(titleClone);
    fragment.appendChild(listClone);
    return fragment;
  }).filter(Boolean);

  // Build the table rows
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
