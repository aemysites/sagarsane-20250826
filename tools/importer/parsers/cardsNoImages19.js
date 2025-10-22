/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cardsNoImages19)'];
  const rows = [headerRow];

  // --- Extract the left column text content as a card (to ensure all text content is included) ---
  const leftColTitle = element.querySelector('.nv-title .title');
  const leftColDesc = element.querySelector('.nv-text .description');
  if (leftColTitle || leftColDesc) {
    const leftContent = [];
    if (leftColTitle) leftContent.push(leftColTitle.cloneNode(true));
    if (leftColDesc) {
      // Get all paragraphs
      const paragraphs = leftColDesc.querySelectorAll('p');
      paragraphs.forEach(p => {
        // Only add non-empty paragraphs
        if (p.textContent.trim()) leftContent.push(p.cloneNode(true));
      });
    }
    if (leftContent.length) {
      rows.push([leftContent]);
    }
  }

  // Only extract the right column cards (teasers)
  const teasers = element.querySelectorAll('.nv-teaser.teaser');
  teasers.forEach(teaser => {
    const cellContent = [];
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) cellContent.push(title.cloneNode(true));
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) cellContent.push(desc.cloneNode(true));
    // CTAs
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctas = Array.from(ctaContainer.querySelectorAll('a'));
      ctas.forEach((cta, i) => {
        cellContent.push(cta.cloneNode(true));
        if (i < ctas.length - 1) cellContent.push(document.createElement('br'));
      });
    }
    if (cellContent.length) {
      rows.push([cellContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
