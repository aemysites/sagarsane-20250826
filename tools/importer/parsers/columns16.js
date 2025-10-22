/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the three column sets (footer link sets)
  const footerLinksWrapper = element.querySelector('.page-footer__links');
  const linkSets = footerLinksWrapper ? getDirectChildren(footerLinksWrapper, '.page-footer-link-set') : [];

  // Find the subscribe area
  const subscribeArea = element.querySelector('.page-footer__subscribe');
  // Find the social area
  const socialArea = element.querySelector('.page-footer__social');

  // Compose the three columns for the main row
  // Defensive: if not found, use empty divs
  const col1 = linkSets[0] || document.createElement('div');
  const col2 = linkSets[1] || document.createElement('div');
  const col3 = linkSets[2] || document.createElement('div');

  // For the bottom row, avoid empty columns: only include cells that have actual content
  // If both subscribe and social exist, put them in left and right columns, leave center out
  // If only one exists, put it in the center column
  let bottomRow;
  if (subscribeArea && socialArea) {
    bottomRow = [subscribeArea, socialArea];
  } else if (subscribeArea) {
    bottomRow = [subscribeArea];
  } else if (socialArea) {
    bottomRow = [socialArea];
  } else {
    bottomRow = [];
  }

  // Build the table rows
  const headerRow = ['Columns (columns16)'];
  const columnsRow = [col1, col2, col3];

  // Only add bottomRow if it has content
  const rows = [headerRow, columnsRow];
  if (bottomRow.length) rows.push(bottomRow);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
