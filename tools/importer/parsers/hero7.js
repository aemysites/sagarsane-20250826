/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest hero container
  let heroContainer = element;
  const refDiv = element.querySelector(':scope > div.nv-reference');
  if (refDiv) heroContainer = refDiv;

  // Find the main content container (nested nv-reference)
  let mainContent = heroContainer;
  const innerRefDiv = heroContainer.querySelector(':scope > div.nv-reference');
  if (innerRefDiv) mainContent = innerRefDiv;

  // Find the background image (img inside .nv-img-as-bg)
  let imageEl = null;
  const bgDiv = mainContent.querySelector('.nv-img-as-bg');
  if (bgDiv) {
    const picture = bgDiv.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img'); // Reference the actual image element
    }
  }

  // Find the heading (h2 inside .nv-title)
  let titleEl = null;
  const titleDiv = mainContent.querySelector('.nv-title');
  if (titleDiv) {
    titleEl = titleDiv.querySelector('h2');
  }

  // Find the subheading/description (p inside .nv-text .description)
  let descEl = null;
  const descDiv = mainContent.querySelector('.nv-text .description');
  if (descDiv) {
    descEl = descDiv.querySelector('p');
  }

  // Find the CTA link (a inside .nv-button)
  let ctaEl = null;
  const buttonDiv = mainContent.querySelector('.nv-button');
  if (buttonDiv) {
    ctaEl = buttonDiv.querySelector('a');
  }

  // Compose the second row (background image)
  const imageRow = [imageEl ? imageEl : ''];

  // Compose the third row (heading, subheading, CTA)
  const textContent = [];
  if (titleEl) textContent.push(titleEl);
  if (descEl) textContent.push(descEl);
  if (ctaEl) textContent.push(ctaEl);
  const textRow = [textContent.length ? textContent : ''];

  // Table rows
  const headerRow = ['Hero (hero7)']; // CRITICAL: Use exact block name
  const rows = [headerRow, imageRow, textRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with block table
  element.replaceWith(block);
}
