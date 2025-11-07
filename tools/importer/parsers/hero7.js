/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the main image (background/hero)
  let img = null;
  const picture = element.querySelector('picture');
  if (picture) {
    // Only reference the actual <img> element, do not clone
    img = picture.querySelector('img');
  }

  // Helper: Find the main heading (h2 or h1)
  let heading = null;
  const headingDiv = element.querySelector('.nv-title .general-container-text');
  if (headingDiv) {
    heading = headingDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Helper: Find the description (paragraph)
  let description = null;
  const descDiv = element.querySelector('.nv-text .description');
  if (descDiv) {
    description = descDiv.querySelector('p');
  }

  // Helper: Find CTA link
  let cta = null;
  const buttonDiv = element.querySelector('.nv-button');
  if (buttonDiv) {
    cta = buttonDiv.querySelector('a');
  }

  // Compose the text cell contents
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (description) textCellContent.push(description);
  if (cta) textCellContent.push(cta);

  // Compose table rows
  const headerRow = ['Hero (hero7)']; // CRITICAL: Use block name exactly
  const imageRow = [img ? img : '']; // Reference the image element, do not clone
  const contentRow = [textCellContent.length ? textCellContent : '']; // All text content and CTA

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
