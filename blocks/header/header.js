import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1023px)');

/* eslint-disable no-use-before-define */
function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');

  if (navSectionExpanded && isDesktop.matches) {
    toggleAllNavSections(navSections);
    navSectionExpanded.focus();
  } else if (!isDesktop.matches) {
    toggleMenu(nav, navSections);
    nav.querySelector('button').focus();
  }
}

function closeOnFocusLost(/* e */) {
  // intentionally left commented for potential future use
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  if (focused.className !== 'nav-drop') return;
  if (e.code !== 'Enter' && e.code !== 'Space') return;

  const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
  toggleAllNavSections(focused.closest('.nav-sections'));
  focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggle all nav sections (set aria-expanded on each)
 * @param {Element} sections
 * @param {Boolean} expanded
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections .dropdowns-wrapper > .menu-item-label')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Toggle the entire nav (hamburger open/close)
 * @param {Element} nav
 * @param {Element} navSections
 * @param {Boolean|null} forceExpanded
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // keyboard accessibility for nav-drop
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // escape/focusout handlers
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Click outside listener to close any expanded menus on desktop
 */
function outsideClickListener(e) {
  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  const expandedSections = navSections.querySelectorAll('[aria-expanded="true"]');

  if (!expandedSections.length) return;

  let clickedInside = false;
  expandedSections.forEach((section) => {
    if (section.contains(e.target)) clickedInside = true;
  });

  if (!clickedInside) {
    toggleAllNavSections(navSections, false);
    navSections.querySelectorAll('.dropdown-menu-label').forEach((lbl) => lbl.classList.remove('is-active'));
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const dropdownsWrapper = document.createElement('div');
    dropdownsWrapper.classList.add('dropdowns-wrapper');

    const sectionsToolsWrapper = document.createElement('div');
    sectionsToolsWrapper.classList.add('sections-tools-wrapper');

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      navSection.classList.add('menu-item-label');
      const navDrop = navSection.querySelector('ul');

      if (navDrop) {
        dropdownsWrapper.appendChild(navSection);
        navDrop.classList.add('nav-drop');

        let itemsWrapper = null;
        let menusWrapper = null;

        if (isDesktop.matches) {
          itemsWrapper = document.createElement('div');
          itemsWrapper.classList.add('dropdown-items-wrapper');

          menusWrapper = document.createElement('div');
          menusWrapper.classList.add('expanded-menus-wrapper');

          navDrop.prepend(menusWrapper);
          navDrop.prepend(itemsWrapper);
        }

        // mega label
        const labelText = document.createElement('span');
        labelText.classList.add('mega-menu-label-text');
        labelText.textContent = navSection.firstChild.textContent.trim();
        navSection.firstChild.textContent = '';
        navSection.prepend(labelText);

        // main click handler for section (mobile + desktop)
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');

          if (isDesktop.matches) {
            const expandedMenus = navSection.querySelectorAll('.expanded-menu');
            expandedMenus.forEach((menu, i) => {
              menu.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
            });

            const dropdownsWrapperEl = navSection.querySelector('.dropdown-items-wrapper');
            if (dropdownsWrapperEl) {
              const labels = dropdownsWrapperEl.querySelectorAll('.dropdown-menu-label');
              labels.forEach((label, i) => {
                label.classList.toggle('is-active', i === 0);
              });
            }
          }
        });

        let hasAnyExpandedMenu = false;
        let hasAnySimpleLabel = false;

        const dropDownMenuLabel = navSection.querySelectorAll(':scope > ul > li');
        dropDownMenuLabel.forEach((label) => {
          label.classList.add('dropdown-menu-label');

          const expandedMenu = label.querySelector('ul');

          // capture label text and wrap in a span for styling
          const dropdownLabelText = label.firstChild.textContent.trim();
          const span = document.createElement('span');
          span.className = 'label-text';
          span.textContent = dropdownLabelText;
          label.innerHTML = '';
          label.appendChild(span);

          if (expandedMenu) {
            hasAnyExpandedMenu = true;

            // build expanded div (works on both desktop and mobile)
            const expandedDiv = document.createElement('div');
            expandedDiv.classList.add('expanded-menu');

            const titleEl = document.createElement('div');
            titleEl.classList.add('expanded-menu-title');
            titleEl.textContent = label.firstChild.textContent.trim();
            expandedDiv.appendChild(titleEl);

            expandedMenu.querySelectorAll(':scope > li').forEach((item) => {
              const link = item.querySelector('a');
              if (!link) return;

              const headingText = document.createElement('span');
              headingText.classList.add('expanded-heading');
              headingText.textContent = link.textContent.trim();

              link.textContent = '';
              link.appendChild(headingText);

              const chevron = document.createElement('span');
              chevron.classList.add('chevron');
              link.appendChild(chevron);

              const wrapper = document.createElement('div');
              wrapper.classList.add('expanded-item-wrapper');
              wrapper.appendChild(link);

              const innerLinks = item.querySelectorAll(':scope > ul > li');
              innerLinks.forEach((innerLi) => {
                innerLi.classList.add('expanded-description');
                link.appendChild(innerLi);
              });

              expandedDiv.appendChild(wrapper);
            });

            // desktop: move into wrapper; mobile: keep inside the li
            if (isDesktop.matches && menusWrapper) {
              menusWrapper.appendChild(expandedDiv);
              expandedMenu.remove();
            } else {
              label.appendChild(expandedDiv);
            }

            // click handler for label (desktop and mobile)
            label.addEventListener('click', (e) => {
              e.stopPropagation();

              const allMenus = navSection.querySelectorAll('.expanded-menu');
              const allLabels = navSection.querySelectorAll('.dropdown-menu-label');

              const isExpanded = expandedDiv.getAttribute('aria-expanded') === 'true';

              if (isDesktop.matches) {
                allMenus.forEach((menu) => {
                  menu.setAttribute('aria-expanded', menu === expandedDiv ? 'true' : 'false');
                });
                allLabels.forEach((l) => l.classList.toggle('is-active', l === label));
              } else if (isExpanded) {
                expandedDiv.setAttribute('aria-expanded', 'false');
                label.classList.remove('is-active');
              } else {
                allMenus.forEach((menu) => {
                  menu.setAttribute('aria-expanded', menu === expandedDiv ? 'true' : 'false');
                });
                allLabels.forEach((l) => l.classList.toggle('is-active', l === label));
              }
            });
          } else {
            hasAnySimpleLabel = true;
            if (!label.querySelector('.chevron')) {
              const chevron = document.createElement('span');
              chevron.classList.add('chevron');
              label.appendChild(chevron);
            }
          }

          // desktop only: move labels into itemsWrapper for layout
          if (isDesktop.matches && itemsWrapper) {
            itemsWrapper.appendChild(label);
          }
        });

        if (!hasAnyExpandedMenu && hasAnySimpleLabel) {
          navDrop.classList.add('simple-dropdown');
          const simpleLabelTitle = document.createElement('span');
          simpleLabelTitle.textContent = navSection.firstChild.textContent.trim();
          simpleLabelTitle.classList.add('expanded-menu-title');
          navDrop.prepend(simpleLabelTitle);
        }
      } else {
        sectionsToolsWrapper.appendChild(navSection);
      }
    });

    navSections.textContent = '';
    navSections.appendChild(dropdownsWrapper);
    navSections.appendChild(sectionsToolsWrapper);
  }

  // attach/remove outside click listener based on desktop state
  if (isDesktop.matches) {
    document.addEventListener('click', outsideClickListener);
  } else {
    document.removeEventListener('click', outsideClickListener);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    if (!isDesktop.matches) {
      const search = navTools.querySelector('.icon-search');
      if (search && hamburger) hamburger.insertAdjacentElement('afterend', search);
    }

    const listItems = navTools.querySelectorAll('li');
    listItems.forEach((li) => {
      const icon = li.querySelector('.icon');
      if (!icon) return;

      const textNodes = [...li.childNodes].filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
      );

      textNodes.forEach((textNode) => {
        const span = document.createElement('span');
        span.classList.add('li-text');
        span.textContent = textNode.textContent.trim();
        li.replaceChild(span, textNode);
      });
    });
  }

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll behavior: hide header on scroll down, show on scroll up
  let lastScrollTop = 0;
  let ticking = false;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down and past threshold
      navWrapper.classList.add('nav-hidden');
    } else if (scrollTop < lastScrollTop) {
      // Scrolling up
      navWrapper.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });
}
