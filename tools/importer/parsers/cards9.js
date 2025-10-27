/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Find the cards container
  const cardsContainer = element.querySelector('.nv-usecase--cards-container');
  if (!cardsContainer) return;

  // Get all card elements
  const cardElements = cardsContainer.querySelectorAll('.nv-usecase--card');

  cardElements.forEach(card => {
    // IMAGE CELL
    // Find the image inside <picture> in <figure>
    const figure = card.querySelector('figure');
    let imageEl = null;
    if (figure) {
      imageEl = figure.querySelector('img');
    }

    // TEXT CELL
    const inner = card.querySelector('.nv-usecase--card-inner-container');
    const textParts = [];
    // Title (h4)
    const title = inner && inner.querySelector('h4');
    if (title) textParts.push(title);
    // Subtitle (p)
    const subtitle = inner && inner.querySelector('.nv-usecase--card-subtitle');
    if (subtitle) textParts.push(subtitle);
    // Body text
    const bodyText = inner && inner.querySelector('.nv-usecase--body-text-wrapper p');
    if (bodyText) textParts.push(bodyText);
    // CTA link
    const cta = inner && inner.querySelector('.nv-button-standard a');
    if (cta) textParts.push(cta);
    // Image credit (figcaption) -- always include, even if empty
    if (figure) {
      const credit = figure.querySelector('figcaption');
      if (credit) textParts.push(credit);
    }

    rows.push([
      imageEl ? imageEl : '',
      textParts.length ? textParts : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
