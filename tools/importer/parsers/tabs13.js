/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab panels and tab labels
  function getTabsAndPanels(root) {
    // Find all tab panels (slides)
    const tabPanels = Array.from(
      root.querySelectorAll('[class*="cmp-carousel__item"]')
    );

    // Find all tab labels from indicators (these are the tab navigation)
    const indicators = Array.from(
      root.querySelectorAll('.cmp-carousel__indicators [data-cmp-hook-carousel="indicator"]')
    );

    // Defensive: If indicators are missing, fallback to progressBox labels
    let tabLabels = [];
    if (indicators.length) {
      tabLabels = indicators.map((li) => li.textContent.trim());
    } else {
      // Fallback: Use progressBox labels
      tabLabels = Array.from(root.querySelectorAll('.progressBox label.progressLabel')).map(l => l.textContent.trim());
    }

    // Also get short descriptions for each tab (from progressDescription)
    const tabDescriptions = Array.from(root.querySelectorAll('.progressBox .progressDescription')).map(desc => desc.textContent.trim());

    // Also get grid images for each tab (from .general-container .nv-image img)
    // We need to find these for each tabPanel
    const tabGridImages = tabPanels.map(panel => {
      return Array.from(panel.querySelectorAll('.general-container .nv-image img'));
    });

    return { tabPanels, tabLabels, tabDescriptions, tabGridImages };
  }

  // Helper to extract content from a tab panel
  function extractTabContent(panel, tabDescription, gridImages) {
    // Find the main container inside the panel
    const container = panel.querySelector('.nv-container');
    if (!container) return panel;

    // Find image background (picture)
    const picture = container.querySelector('.nv-img-as-bg picture');
    // Find all title elements
    const smallTitle = container.querySelector('.nv-title.h--smaller .title, .nv-title.h--smaller p.title');
    const largeTitle = container.querySelector('.nv-title.h--large .title, .nv-title.h--large h2.title');
    // Find description
    const description = container.querySelector('.nv-text .description');
    // Find button
    const button = container.querySelector('.nv-button a');

    // Compose content block
    const block = document.createElement('div');
    // Add the short tab description at the top of the content cell
    if (tabDescription) {
      const descP = document.createElement('p');
      descP.textContent = tabDescription;
      block.appendChild(descP);
    }
    if (picture) block.appendChild(picture.cloneNode(true));
    // If there are grid images, add them as a grid
    if (gridImages && gridImages.length) {
      const gridDiv = document.createElement('div');
      gridDiv.style.display = 'grid';
      gridDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
      gridImages.forEach(img => {
        gridDiv.appendChild(img.cloneNode(true));
      });
      block.appendChild(gridDiv);
    }
    if (smallTitle) block.appendChild(smallTitle.cloneNode(true));
    if (largeTitle) block.appendChild(largeTitle.cloneNode(true));
    if (description) block.appendChild(description.cloneNode(true));
    if (button) block.appendChild(button.cloneNode(true));

    return block;
  }

  // Get tabs and panels
  const { tabPanels, tabLabels, tabDescriptions, tabGridImages } = getTabsAndPanels(element);

  // Build rows: header + one row per tab
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs13)']);

  // For each tab, add [label, content] row
  tabPanels.forEach((panel, idx) => {
    // Defensive: If tabLabels[idx] missing, fallback to aria-label or panel label
    let label = tabLabels[idx];
    if (!label) {
      label = panel.getAttribute('aria-label') || `Tab ${idx + 1}`;
    }
    // Extract content, now passing the short description and grid images to the content cell
    const content = extractTabContent(panel, tabDescriptions[idx], tabGridImages[idx]);
    rows.push([label, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
