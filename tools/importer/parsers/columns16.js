/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a column block (heading + links)
  function extractColumn(colElem) {
    const parts = [];
    // Heading
    const heading = colElem.querySelector('.page-footer-link-set__title');
    if (heading) parts.push(heading);
    // Links
    const linksList = colElem.querySelector('.page-footer-link-set__links');
    if (linksList) parts.push(linksList);
    return parts;
  }

  // Get the three main columns
  const columns = Array.from(element.querySelectorAll('.page-footer-link-set.set-3')).map(extractColumn);

  // Newsletter signup block
  const subscribeContainer = element.querySelector('.subscribe-container');
  // Social media block
  const socialElem = element.querySelector('.page-footer__social');

  // Compose the table rows
  const headerRow = ['Columns (columns16)'];
  // First content row: the three columns
  const columnsRow = columns.map(col => col);
  // Second content row: newsletter signup (left), empty (middle), social bar (right)
  const footerRow = [subscribeContainer, '', socialElem];

  // Build the table
  const cells = [
    headerRow,
    columnsRow,
    footerRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
