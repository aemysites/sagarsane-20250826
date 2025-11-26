/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

/*
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';
*/


/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {Promise<HTMLElement>} The root element of the fragment
 */
/*export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}*/

import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {

  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }

    wrapCardBodies(block);

    toggleQuickLinksarrow(block);

    initHorizontalScroller(
        ".horizontal-scroller-wrapper .horizontal-scroller",
        ".default-content-wrapper .icon-chevron-left",
        ".default-content-wrapper .icon-chevron-right",
        410 // scroll px amount (adjust)
      );
  }

/**
 * Helper function — wraps <picture> and following .cards-card-body inside <a>
 */
function wrapCardBodies(container) {
  const cardPairs = container.querySelectorAll('.cards.h-cards.block li');

  cardPairs.forEach(li => {
    const cardBodies = li.querySelectorAll('.cards-card-body');
    if (cardBodies.length >= 2) {
      const imageCard = cardBodies[0];
      const textCard = cardBodies[1];
      const link = imageCard.querySelector('a');

      if (link) {
        const href = link.getAttribute('href');

        // Hide the <p> containing <a>
        link.parentElement.style.display = 'none';

        // Create wrapper anchor
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.target = '_blank';
        anchor.classList.add('card-link-wrapper');

        // Move the two card bodies inside the anchor
        anchor.appendChild(imageCard);
        anchor.appendChild(textCard);

        // Replace original contents of <li> with the new <a> wrapper
        li.innerHTML = '';
        li.appendChild(anchor);
      }
    }
  });
}

/*==Toggle Quick Links arrow ====*/
function toggleQuickLinksarrow(container) {
  const cards = container.querySelectorAll('.cards.h-text.block .cards-card-body');

  cards.forEach(card => {
    const down = card.querySelector('.icon-angle-down');
    const up = card.querySelector('.icon-angle-up');
    const ul = card.querySelector('ul');

    if (down && up && ul) {
      // Initial state
      ul.style.display = 'none';
      up.style.display = 'none';
      down.style.cursor = up.style.cursor = 'pointer';
      down.style.marginRight = up.style.marginRight = '10px';
      down.style.top = up.style.top = '5px';
      down.style.position  = up.style.position  = 'relative'

      // Show list
      down.addEventListener('click', () => {
        ul.style.display = 'block';
        down.style.display = 'none';
        up.style.display = 'inline-block';
        up.style.height= "24px";
        up.style.width = "24px";
      });

      // Hide list
      up.addEventListener('click', () => {
        ul.style.display = 'none';
        down.style.display = 'inline-block';
        down.style.height= "24px";
        down.style.width = "24px";
        up.style.display = 'none';
      });
    }
  });
}

/*====Click scroll the horizontal scroller =======*/

 function initHorizontalScroller(scrollerSelector, leftSelector, rightSelector, scrollAmount) {
   const scroller =document.querySelector(scrollerSelector);
   const btnLeft  = document.querySelector(leftSelector);
   const btnRight = document.querySelector(rightSelector);

   if (!scroller || !btnLeft || !btnRight) return;

   btnRight.addEventListener("click", () => {
   console.log("right");
     scroller.scrollBy({ left: scrollAmount, behavior: "smooth" });
   });

   btnLeft.addEventListener("click", () => {
   console.log("left");
     scroller.scrollBy({ left: -scrollAmount, behavior: "smooth" });
   });
 }
