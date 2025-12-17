/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the two column containers
  function getColumnContainers(el) {
    // Find .aem-Grid > .aem-GridColumn that contain .aem-Grid inside
    const grids = Array.from(el.querySelectorAll('.aem-Grid > .aem-GridColumn'));
    return grids.filter(g => g.querySelector('.aem-Grid'));
  }

  // Extract main section heading and headline
  const mainGrid = element.querySelector('.aem-Grid');
  let sectionTitle = null;
  let sectionSubtitle = null;
  if (mainGrid) {
    const smallestTitle = mainGrid.querySelector('.nv-title.text.h--smallest .title');
    if (smallestTitle) sectionTitle = smallestTitle.cloneNode(true);
    const mediumTitle = mainGrid.querySelector('.nv-title.text.h--medium .title');
    if (mediumTitle) sectionSubtitle = mediumTitle.cloneNode(true);
  }

  // Insert heading and headline above the block
  if (sectionTitle || sectionSubtitle) {
    const wrapper = document.createElement('div');
    if (sectionTitle) wrapper.appendChild(sectionTitle);
    if (sectionSubtitle) wrapper.appendChild(sectionSubtitle);
    element.parentNode.insertBefore(wrapper, element);
  }

  // Extract columns
  const colContainers = getColumnContainers(element);
  function extractColumnContent(colEl) {
    const colGrid = colEl.querySelector('.aem-Grid');
    if (!colGrid) return document.createElement('div');
    const titleEl = colGrid.querySelector('.nv-title .title');
    const descEl = colGrid.querySelector('.nv-text .description');
    const btnWrap = colGrid.querySelector('.nv-button-standard');
    let btnEl = null;
    if (btnWrap) btnEl = btnWrap.querySelector('a');
    const cell = document.createElement('div');
    if (titleEl) cell.appendChild(titleEl.cloneNode(true));
    if (descEl) cell.appendChild(descEl.cloneNode(true));
    if (btnEl) cell.appendChild(btnEl.cloneNode(true));
    return cell;
  }
  let columnsRow = [];
  if (colContainers.length === 2) {
    columnsRow = colContainers.map(extractColumnContent);
  } else {
    columnsRow = Array.from(element.querySelectorAll('.aem-GridColumn')).filter(
      c => c.querySelector('.aem-Grid')
    ).map(extractColumnContent);
  }

  // Table: header row, then columns row
  const headerRow = ['Columns (columns11)'];
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
