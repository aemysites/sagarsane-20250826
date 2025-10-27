/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left-side hero/intro block (heading, description, quick links)
  const heroContainer = document.createElement('div');
  // Heading
  const heading = element.querySelector('h3.cmp-carousel__title');
  if (heading) heroContainer.appendChild(heading.cloneNode(true));
  // Description paragraph
  const desc = element.querySelector('.cmp-carousel__item .cmp-teaser__description');
  if (desc) heroContainer.appendChild(desc.cloneNode(true));
  // Quick Links label and icon
  const quickLinksRow = element.querySelector('.cmp-carousel__item .row1.cmp-teaser__quick-links');
  if (quickLinksRow) {
    const quickLinksContainer = document.createElement('div');
    // Icon
    const icon = quickLinksRow.querySelector('.cmp-teaser__action-icon');
    if (icon) quickLinksContainer.appendChild(icon.cloneNode(true));
    // Label
    const label = quickLinksRow.querySelector('.quick-links-text');
    if (label) quickLinksContainer.appendChild(label.cloneNode(true));
    heroContainer.appendChild(quickLinksContainer);
  }
  // Quick Links (actual links)
  const quickLinksBox = element.querySelector('.cmp-carousel__item .quick-links-box');
  if (quickLinksBox) {
    const links = Array.from(quickLinksBox.querySelectorAll('a'));
    if (links.length) {
      const linksDiv = document.createElement('div');
      links.forEach(link => {
        const icon = link.querySelector('.cmp-teaser__action-link-icon');
        if (icon) icon.remove();
        linksDiv.appendChild(link.cloneNode(true));
        linksDiv.appendChild(document.createElement('br'));
      });
      heroContainer.appendChild(linksDiv);
    }
  }

  // Table header
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];
  // First row: left cell empty, right cell is heroContainer
  rows.push(['', heroContainer]);

  // Parse actual cards (from 2nd onward)
  const carouselRoot = element.querySelector('.cmp-carousel');
  const slidesContainer = carouselRoot && carouselRoot.querySelector('.cmp-carousel__slides');
  const cardEls = slidesContainer ? Array.from(slidesContainer.children) : [];
  for (let i = 1; i < cardEls.length; i++) {
    const card = cardEls[i];
    // Image (first cell)
    let imageEl = null;
    const imgLink = card.querySelector('.cmp-teaser__image a');
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }
    if (!imageEl) {
      imageEl = card.querySelector('img');
    }
    const leftCell = imageEl ? imageEl.cloneNode(true) : '';
    // Compose right cell: pretitle, title, description, credit line
    const textContainer = document.createElement('div');
    const pretitle = card.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContainer.appendChild(pretitle.cloneNode(true));
    const title = card.querySelector('.cmp-teaser__title');
    if (title) textContainer.appendChild(title.cloneNode(true));
    const desc = card.querySelector('.cmp-teaser__description');
    if (desc) textContainer.appendChild(desc.cloneNode(true));
    const credit = card.querySelector('.nv-credit-line');
    if (credit) textContainer.appendChild(credit.cloneNode(true));
    // Wrap with link if card has a CTA (entire card link)
    const cardLink = card.querySelector('.cmp-teaser__link-entire-card');
    if (cardLink && cardLink.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      link.target = cardLink.getAttribute('target') || '_self';
      link.rel = cardLink.getAttribute('rel') || '';
      link.appendChild(textContainer);
      rows.push([leftCell, link]);
      continue;
    }
    rows.push([leftCell, textContainer]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
