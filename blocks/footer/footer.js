import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/** sanitize a raw data-section-id into a safe CSS class */
function toSafeClass(raw) {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/** ensure idClass is the second class after 'section' */
function reorderSectionClasses(section, idClass) {
  if (!section || !idClass) return;
  const classes = Array.from(section.classList);
  // remove all occurrences of idClass and 'section' from the remainder
  const filtered = classes.filter((c) => c !== idClass && c !== 'section');
  section.className = ['section', idClass, ...filtered].join(' ').trim();
}

/** add sanitized classes to elements within root that have data-section-id */
function addSectionIdClasses(root) {
  if (!root) return;
  root.querySelectorAll('[data-section-id]').forEach((el) => {
    const raw = el.getAttribute('data-section-id');
    if (!raw) return;
    const safe = toSafeClass(raw);
    if (safe && !el.classList.contains(safe)) el.classList.add(safe);
  });
}

/** add aria labels for icon-only or social links */
function addAccessibilityLabels(footer) {
  if (!footer) return;
  const socialMediaMap = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'twitter.com': 'Twitter',
    'x.com': 'X (Twitter)',
    'youtube.com': 'YouTube',
  };
  const links = footer.querySelectorAll('a');
  links.forEach((link) => {
    if (link.getAttribute('aria-label') || (link.textContent && link.textContent.trim().length)) return;
    const href = link.href || '';
    Object.keys(socialMediaMap).forEach((domain) => {
      if (href.includes(domain) && !link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', socialMediaMap[domain]);
      }
    });
  });
}

/** ensure section gets the id-class and ordering; returns true if applied */
function ensureSectionIdClass(section) {
  if (!section) return false;
  const raw = section.getAttribute('data-section-id') || section.dataset.sectionId;
  if (!raw) return false;
  const safe = toSafeClass(raw);
  if (!safe) return false;
  if (!section.classList.contains(safe)) section.classList.add(safe);
  reorderSectionClasses(section, safe);
  return true;
}

/** main decorate function */
export default async function decorate(block) {
  // find parent section (may or may not already have data-section-id/class)
  const section = block.closest('.section');

  // If section isn't ready yet, use a MutationObserver 
  // to wait for its data-section-id or class attr,
  // then apply once and disconnect. But try immediate application first.
  if (section) {
    const applied = ensureSectionIdClass(section);
    if (!applied) {
      // watch for the data-section-id being added or changed (short-lived observer)
      const obs = new MutationObserver((mutations, observer) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'data-section-id' || m.attributeName === 'class')) {
            if (ensureSectionIdClass(section)) {
              observer.disconnect();
              return;
            }
          }
        }
      });
      obs.observe(section, { attributes: true, attributeFilter: ['data-section-id', 'class'] });

      // Also guard: stop observing after 3s to avoid leaking observers
      setTimeout(() => obs.disconnect(), 3000);
    }
  }

  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // add sanitized id classes within the fragment
  addSectionIdClasses(footer);

  // also add to the block element itself (sanitized)
  if (block.hasAttribute('data-section-id')) {
    const raw = block.getAttribute('data-section-id');
    const safe = toSafeClass(raw);
    if (safe && !block.classList.contains(safe)) {
      // insert it as first class after 'block' if you'd like; here we'll just add it
      block.classList.add(safe);
    }
  }

  // convert absolute NVIDIA URLs to relative paths for local development
  footer.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('https://www.nvidia.com/') || href.startsWith('http://www.nvidia.com/'))) {
      const url = new URL(href);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    } else if (href && (href.startsWith('https://images.nvidia.com/') || href.startsWith('http://images.nvidia.com/'))) {
      const url = new URL(href);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    }
  });

  // accessibility
  addAccessibilityLabels(footer);

  block.append(footer);
}
