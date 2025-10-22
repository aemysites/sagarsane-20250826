/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Find the container holding all cards
  const cardsContainer = element.querySelector('.nv-usecase--cards-container');
  if (!cardsContainer) return;

  // Select all card elements inside the container
  const cardEls = cardsContainer.querySelectorAll('.nv-usecase--card');

  cardEls.forEach(cardEl => {
    // --- IMAGE CELL ---
    // Find the image (inside <figure><picture><img>)
    let imgEl = null;
    const figure = cardEl.querySelector('figure');
    if (figure) {
      imgEl = figure.querySelector('img');
    }

    // --- TEXT CELL ---
    // Title (h4), subtitle (p), description (body-text), CTA (a), Image Credit (figcaption)
    const inner = cardEl.querySelector('.nv-usecase--card-inner-container');
    const textContent = [];
    if (inner) {
      // Title
      const title = inner.querySelector('h4');
      if (title) textContent.push(title);
      // Subtitle
      const subtitle = inner.querySelector('.nv-usecase--card-subtitle');
      if (subtitle) textContent.push(subtitle);
      // Description
      const bodyTextWrapper = inner.querySelector('.nv-usecase--body-text-wrapper');
      if (bodyTextWrapper) {
        // Usually contains a <p>
        const desc = bodyTextWrapper.querySelector('p');
        if (desc) textContent.push(desc);
      }
      // CTA (button link)
      const cta = inner.querySelector('.nv-button-standard a');
      if (cta) textContent.push(cta);
    }
    // Image credit (figcaption) - wrap in a span for clarity
    if (figure) {
      const credit = figure.querySelector('figcaption');
      if (credit && credit.textContent.trim()) {
        const creditSpan = document.createElement('span');
        creditSpan.textContent = credit.textContent.trim();
        creditSpan.className = 'image-credit';
        textContent.push(creditSpan);
      }
    }

    // Compose row: [image, text]
    const row = [imgEl, textContent];
    rows.push(row);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
