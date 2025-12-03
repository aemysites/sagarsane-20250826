/* global WebImporter */
export default function parse(element, { document }) {
  // Find image (left column)
  const imageDiv = element.querySelector('.nv-image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the right column container (contains heading and description)
  let textContainer = null;
  const containers = element.querySelectorAll('.nv-container');
  if (containers.length > 1) {
    textContainer = containers[1]; // The second .nv-container is the right column
  }

  // Extract all text content from the right column (including heading and description)
  let rightCell = '';
  if (textContainer) {
    // Get all heading and paragraph elements in the right column
    const headings = textContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = textContainer.querySelectorAll('p');
    const cellContent = document.createElement('div');
    headings.forEach(h => {
      cellContent.appendChild(h.cloneNode(true));
    });
    paragraphs.forEach(p => {
      cellContent.appendChild(p.cloneNode(true));
    });
    // If we got any content, use it
    if (cellContent.childNodes.length > 0) {
      rightCell = cellContent;
    }
    // Fallback: If still empty, get all text nodes in right column
    if (!rightCell) {
      const fallbackContent = document.createElement('div');
      Array.from(textContainer.querySelectorAll('*')).forEach(el => {
        if (el.textContent.trim().length > 0) {
          fallbackContent.appendChild(el.cloneNode(true));
        }
      });
      if (fallbackContent.childNodes.length > 0) {
        rightCell = fallbackContent;
      }
    }
  }

  // Build the Columns block table
  const headerRow = ['Columns (columns20)'];
  const contentRow = [imageEl ? imageEl.cloneNode(true) : '', rightCell || ''];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element
  element.replaceWith(table);
}
