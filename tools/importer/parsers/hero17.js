/* global WebImporter */
export default function parse(element, { document }) {
  // Extract breadcrumb text ('Industries / Robotics')
  let breadcrumb = '';
  // The breadcrumb is typically at the top, as the first text node in the first child div
  const firstDiv = element.querySelector(':scope > div');
  if (firstDiv) {
    // Find the first text node that contains a '/'
    const walker = document.createTreeWalker(firstDiv, NodeFilter.SHOW_TEXT, null);
    let found = false;
    while (walker.nextNode() && !found) {
      const txt = walker.currentNode.textContent.trim();
      if (/Industries\s*\/\s*Robotics/.test(txt)) {
        breadcrumb = txt.match(/Industries\s*\/\s*Robotics/)[0];
        found = true;
      }
    }
  }

  // Extract background image (<img> inside .nv-img-as-bg)
  const bgImgContainer = element.querySelector('.nv-img-as-bg');
  let bgImg = '';
  if (bgImgContainer) {
    const img = bgImgContainer.querySelector('img');
    if (img) bgImg = img;
  }

  // Extract headline (h1 inside .nv-title or .general-container)
  let headline = '';
  const h1 = element.querySelector('h1');
  if (h1) headline = h1;

  // Compose content row: breadcrumb + headline (both as elements if possible)
  const contentRowContent = [];
  if (breadcrumb) {
    contentRowContent.push(document.createTextNode(breadcrumb));
  }
  if (headline) contentRowContent.push(headline);

  // Table rows
  const headerRow = ['Hero (hero17)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
