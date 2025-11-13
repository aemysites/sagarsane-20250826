export default function decorate(block) {
  // Extract the two anchor buttons from authoring
  const links = block.querySelectorAll('a.button');
  if (links.length < 2) return;

  const agreementsBtn = links[0];
  const pdfBtn = links[1];

  // --- MAIN WRAPPER ---
  const wrapper = document.createElement('div');
  wrapper.className = 'agreement-header-block';

  // --- LEFT SIDE ---
  const left = document.createElement('div');
  left.className = 'agreement-left';

  // DESKTOP fixed title
  const desktopRow = document.createElement('div');
  desktopRow.className = 'agreement-desktop';

  const desktopLink = document.createElement('a');
  desktopLink.className = 'button secondary';
  desktopLink.href = agreementsBtn.href;
  desktopLink.title = agreementsBtn.title;
  desktopLink.textContent = agreementsBtn.textContent;

  desktopRow.appendChild(desktopLink);

  // MOBILE toggle row
  const mobileRow = document.createElement('div');
  mobileRow.className = 'agreement-mobile';

  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'agreement-mobile-toggle';
  mobileToggle.innerHTML = `
    <span class="text">${agreementsBtn.textContent}</span>
    <svg class="arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 6L11 1" stroke="white" stroke-width="2" 
      stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
  mobileRow.appendChild(mobileToggle);

  // DROPDOWN panel
  const dropdown = document.createElement('div');
  dropdown.className = 'agreement-dropdown';
  dropdown.innerHTML = `
    <a href="${agreementsBtn.href}" class="dropdown-item">${agreementsBtn.textContent}</a>
  `;

  // Add rows to left side
  left.appendChild(desktopRow);
  left.appendChild(mobileRow);
  left.appendChild(dropdown);

  // --- RIGHT SIDE ---
  const right = document.createElement('div');
  right.className = 'agreement-right';

  const pdfLink = document.createElement('a');
  pdfLink.className = 'button primary';
  pdfLink.href = pdfBtn.href;
  pdfLink.title = pdfBtn.title;
  pdfLink.textContent = pdfBtn.textContent;
  pdfLink.setAttribute('role', 'button');

  right.appendChild(pdfLink);

  // Build final layout
  wrapper.appendChild(left);
  wrapper.appendChild(right);

  // Inject into the block
  block.textContent = '';
  block.appendChild(wrapper);

  // --- MOBILE DROPDOWN LOGIC ---
  mobileToggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
    mobileToggle.classList.toggle('expanded');
  });

  // --- NEW: Close dropdown when clicking dropdown item ---
  const dropdownItem = dropdown.querySelector('.dropdown-item');
  if (dropdownItem) {
    dropdownItem.addEventListener('click', () => {
      dropdown.classList.remove('open');
      mobileToggle.classList.remove('expanded');
      // link will open normally, no preventDefault()
    });
  }
}
