/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the cards2 block
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the carousel slides container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  const slidesContainer = carouselContent ? carouselContent.querySelector('.cmp-carousel__slides') : null;

  // Only process if we have slides container
  if (slidesContainer) {
    // Get all visible card items (each slide)
    const cardItems = Array.from(slidesContainer.children).filter(
      (child) => child.classList.contains('cmp-carousel__item')
    );

    // Helper to extract card content
    function extractCard(cardEl) {
      // Image (first cell)
      let imageCell = null;
      const teaserHolder = cardEl.querySelector('.nv-teaser--holder');
      if (teaserHolder) {
        // Try to find image inside teaserHolder
        const imgLink = teaserHolder.querySelector('.cmp-image__link');
        if (imgLink) {
          const img = imgLink.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }

      // Text (second cell)
      let textCell = document.createElement('div');
      textCell.style.display = 'flex';
      textCell.style.flexDirection = 'column';

      // Pretitle
      const pretitle = cardEl.querySelector('.cmp-teaser__pretitle');
      if (pretitle) {
        textCell.appendChild(pretitle.cloneNode(true));
      }

      // Title (h3)
      const title = cardEl.querySelector('.cmp-teaser__title');
      if (title) {
        textCell.appendChild(title.cloneNode(true));
      }

      // Description
      const desc = cardEl.querySelector('.cmp-teaser__description');
      if (desc) {
        textCell.appendChild(desc.cloneNode(true));
      }

      // Credit line (optional)
      const creditLine = cardEl.querySelector('.nv-credit-line');
      if (creditLine) {
        textCell.appendChild(creditLine.cloneNode(true));
      }

      // CTA (card link)
      const cardLink = cardEl.querySelector('.cmp-teaser__link-entire-card');
      if (cardLink && cardLink.href) {
        // Try to find a CTA text (usually the title)
        let ctaText = '';
        const linkTitle = cardLink.querySelector('.cmp-teaser__title');
        if (linkTitle) {
          ctaText = linkTitle.textContent.trim();
        } else {
          ctaText = cardLink.textContent.trim();
        }
        if (ctaText) {
          const cta = document.createElement('a');
          cta.href = cardLink.href;
          cta.textContent = ctaText;
          cta.target = cardLink.target || '_self';
          if (cardLink.rel) cta.rel = cardLink.rel;
          textCell.appendChild(cta);
        }
      }

      // If no image, fallback to teaserHolder (could be icon)
      if (!imageCell && teaserHolder) {
        imageCell = teaserHolder.cloneNode(true);
      }

      return [imageCell, textCell];
    }

    // Only include actual cards (skip the first slide, which is an intro)
    for (let i = 1; i < cardItems.length; i++) {
      const cardRow = extractCard(cardItems[i]);
      rows.push(cardRow);
    }
  }

  // Always replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
