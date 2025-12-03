/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row (block name)
  const headerRow = ['Hero (hero17)'];

  // --- Row 2: Background Image (optional) ---
  let bgImg = null;
  const imgContainer = element.querySelector('.nv-img-as-bg');
  if (imgContainer) {
    const picture = imgContainer.querySelector('picture');
    if (picture) {
      bgImg = picture.querySelector('img');
    }
  }
  const imageRow = [bgImg ? bgImg : ''];

  // --- Row 3: Text Content (breadcrumb, title, subheading, CTA) ---
  let textContent = [];

  // Extract breadcrumb text ("Industries / Robotics")
  // Look for any element or text node containing the breadcrumb
  let breadcrumb = '';
  // Try to find a div/span/p with breadcrumb pattern
  const possibleBreadcrumb = Array.from(element.querySelectorAll('div, span, p'))
    .find(el => el.textContent.trim().match(/Industries\s*\/\s*Robotics/));
  if (possibleBreadcrumb) {
    breadcrumb = possibleBreadcrumb.textContent.trim();
  } else {
    // Fallback: try any text node in the element
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim().match(/Industries\s*\/\s*Robotics/)) {
        breadcrumb = node.textContent.trim();
        break;
      }
    }
  }
  if (breadcrumb) {
    const p = document.createElement('p');
    p.textContent = breadcrumb;
    textContent.push(p);
  }

  // The headline is inside .nv-title h1
  const titleContainer = element.querySelector('.nv-title');
  if (titleContainer) {
    const h1 = titleContainer.querySelector('h1');
    if (h1) {
      textContent.push(h1);
    }
    // Look for subheading (h2, h3, p) directly under the title container
    const possibleSubs = titleContainer.querySelectorAll('h2, h3, p');
    possibleSubs.forEach((el) => {
      if (el !== h1) {
        textContent.push(el);
      }
    });
    // Look for CTA (anchor) inside the title container
    const cta = titleContainer.querySelector('a[href]');
    if (cta) {
      textContent.push(cta);
    }
  }

  const textRow = [textContent.length ? textContent : ''];

  // Compose table rows
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
