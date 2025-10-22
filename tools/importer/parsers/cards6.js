/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parser
  const newsFeed = element.querySelector('.latest-news__items');
  if (!newsFeed) return;

  const cardEls = Array.from(newsFeed.querySelectorAll('.latest-news__item'));
  if (!cardEls.length) return;

  const rows = [];
  rows.push(['Cards (cards6)']);

  cardEls.forEach(card => {
    // Image cell
    const keyVisual = card.querySelector('.latest-news__item__key-visual');
    let imgEl = keyVisual ? keyVisual.querySelector('img') : null;
    const imgCell = imgEl || '';

    // Text cell
    const body = card.querySelector('.latest-news__item__body');
    let textFragments = [];
    if (body) {
      // Date
      const date = body.querySelector('.latest-news__item__body__date');
      if (date) {
        const dateP = document.createElement('p');
        dateP.textContent = date.textContent.trim();
        dateP.style.fontSize = 'small';
        textFragments.push(dateP);
      }
      // Title
      const title = body.querySelector('.latest-news__item__body__title');
      if (title) {
        const titleEl = document.createElement('strong');
        titleEl.textContent = title.textContent.trim();
        textFragments.push(titleEl);
      }
      // Description
      const desc = body.querySelector('.latest-news__item__body__description');
      if (desc) {
        let descText = desc.textContent.trim();
        // If there's a trailing link, extract it and append as a CTA
        const link = desc.querySelector('a');
        if (link && link.textContent.trim()) {
          // Remove link text from descText if present
          descText = descText.replace(link.textContent.trim(), '').trim();
          const descP = document.createElement('p');
          descP.textContent = descText;
          textFragments.push(descP);
          // Add CTA link as its own element
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.textContent = link.textContent.trim();
          textFragments.push(cta);
        } else {
          // If no link, just add the description
          const descP = document.createElement('p');
          descP.textContent = descText;
          textFragments.push(descP);
        }
      }
    }
    rows.push([imgCell, textFragments]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
