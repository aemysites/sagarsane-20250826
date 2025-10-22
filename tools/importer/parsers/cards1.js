/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) block header
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find the carousel slides container
  const slidesContainer = element.querySelector('.cmp-carousel__slides');
  
  if (slidesContainer) {
    // Get all card items (each slide is a card)
    const cardItems = Array.from(slidesContainer.querySelectorAll('.cmp-carousel__item'));

    cardItems.forEach((item) => {
      if (item.getAttribute('aria-hidden') === 'true') return;

      // Card image (first column)
      let imageEl = null;
      const teaserImage = item.querySelector('.cmp-teaser__image img');
      if (teaserImage) {
        imageEl = teaserImage;
      }

      // Card text content (second column)
      let textContent = [];
      const textContainer = item.querySelector('.general-container-text');
      if (textContainer) {
        // For the first slide (intro block), if no image, get all paragraphs and spans and quick links
        if (!imageEl) {
          Array.from(textContainer.querySelectorAll('p, span')).forEach((el) => {
            if (el.textContent && el.textContent.trim()) {
              textContent.push(el);
            }
          });
          // Get quick links label and icon if present
          const quickLinksRow = item.querySelector('.cmp-teaser__quick-links');
          if (quickLinksRow) textContent.push(quickLinksRow);
          const quickLinksBox = item.querySelector('.quick-links-box');
          if (quickLinksBox) {
            const quickLinks = Array.from(quickLinksBox.querySelectorAll('a'));
            if (quickLinks.length) {
              textContent = textContent.concat(quickLinks);
            }
          }
        } else {
          // For cards with images, get all text content from textLeft container
          const textLeft = textContainer.querySelector('.text-left, .lap-text-left, .tab-text-left, .mob-text-left');
          if (textLeft) {
            Array.from(textLeft.children).forEach((child) => {
              if (child.textContent && child.textContent.trim()) {
                textContent.push(child);
              }
            });
          }
        }
      }

      // Compose row: always [image, textContent]
      if (imageEl || textContent.length) {
        rows.push([
          imageEl ? imageEl : '',
          textContent.length ? textContent : ''
        ]);
      }
    });
  }

  // Always create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
