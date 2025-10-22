/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract column content from a grid column container
  function extractColumnContent(col) {
    const parts = [];
    // Title (h2 or h3)
    const title = col.querySelector('h2, h3');
    if (title) parts.push(title);
    // Description (div.description or p)
    const desc = col.querySelector('.description, p');
    if (desc) parts.push(desc);
    // Button (a.btn-content, a.btncta)
    const btn = col.querySelector('a.btn-content, a.btncta');
    if (btn) parts.push(btn);
    return parts;
  }

  // Find the main grid columns (top-level responsivegrid children)
  const topGrid = element.querySelector('.aem-Grid');
  if (!topGrid) return;

  // Find the two column containers (each is a responsivegrid)
  const columns = Array.from(topGrid.children)
    .filter(child => child.classList.contains('responsivegrid'));
  if (columns.length < 2) return;

  // For each column, extract its grid and content
  const colCells = columns.map(col => {
    // Each column has a nested .aem-Grid with its content blocks
    const innerGrid = col.querySelector('.aem-Grid');
    if (!innerGrid) return [];
    // Compose all relevant content from the innerGrid
    return extractColumnContent(innerGrid);
  });

  // Defensive: flatten arrays, but keep each column's content grouped
  const row = colCells.map(parts => parts);

  // Table header
  const headerRow = ['Columns (columns4)'];
  // Table rows: second row is the columns
  const cells = [headerRow, row];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
