/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract column content from source HTML
  function getColumnContent(container) {
    const col = [];
    // Title
    const title = container.querySelector('.nv-title .title');
    if (title) col.push(title);
    // Description
    const desc = container.querySelector('.nv-text .description, .nv-text p');
    if (desc) col.push(desc);
    // Button (CTA)
    const btn = container.querySelector('.nv-button a');
    if (btn) col.push(btn);
    return col;
  }

  // Find top-level column containers (the two main columns)
  // Use :scope > div > div > div > div to get the two main columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;
  const columns = Array.from(mainGrid.children).filter(
    (child) => child.classList.contains('nv-container')
  );

  // Defensive: fallback if columns not found
  if (columns.length < 2) return;

  // Extract content for each column
  const leftCol = getColumnContent(columns[0]);
  const rightCol = getColumnContent(columns[1]);

  // Build table rows
  const headerRow = ['Columns (columns4)'];
  const contentRow = [leftCol, rightCol];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
