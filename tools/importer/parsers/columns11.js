/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const headerRow = ['Columns (columns11)'];

  // Find the section label and main heading
  const allH2s = element.querySelectorAll('h2.title');
  let label = null, mainHeading = null;
  if (allH2s.length > 1) {
    label = allH2s[0];
    mainHeading = allH2s[1];
  } else if (allH2s.length === 1) {
    mainHeading = allH2s[0];
  }
  const headingCell = document.createElement('div');
  if (label) headingCell.appendChild(label.cloneNode(true));
  if (mainHeading) headingCell.appendChild(mainHeading.cloneNode(true));
  // Insert the heading above the table, not as a table row
  element.insertBefore(headingCell, element.firstChild);

  // Find the two column containers
  const columnContainers = Array.from(
    element.querySelectorAll('.nv-container.container.responsivegrid')
  ).filter(colEl => colEl.querySelector('h3'));

  // Extract content for each column
  function extractColumnContent(colEl) {
    const cell = document.createElement('div');
    const heading = colEl.querySelector('h3');
    if (heading) cell.appendChild(heading.cloneNode(true));
    const desc = colEl.querySelector('.description p');
    if (desc) cell.appendChild(desc.cloneNode(true));
    const cta = colEl.querySelector('.nv-button-standard a');
    if (cta) cell.appendChild(cta.cloneNode(true));
    return cell;
  }
  const columnsRow = columnContainers.map(extractColumnContent);
  // If only one column found, pad to two columns
  while (columnsRow.length < 2) columnsRow.push('');

  // Build the table
  const cells = [
    headerRow,
    columnsRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
