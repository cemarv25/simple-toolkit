import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/variables.css';
import './styles/global.css';

import { BASE_URL, SITE_URL, type Page, type Tool, tools, footerLinks } from './config/pages-config';

// Global elements
let menuToggle: HTMLButtonElement;
let sidebar: HTMLElement;
let toolContainer: HTMLElement;
let menuNav: HTMLElement;

async function initPrivacyBanner() {
  try {
    const { initGoogleConsentMode, applySavedConsent } = await import('./utils/preferences');
    initGoogleConsentMode();
    applySavedConsent();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Privacy preferences could not be initialized:', message);
  }
}

const getSafeTheme = () => {
  try {
    return localStorage.getItem('theme') || 'default';
  } catch (e) {
    return 'default';
  }
};

function init() {
  try {
    // Initial DOM binding
    menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
    sidebar = document.getElementById('sidebar') as HTMLElement;
    toolContainer = document.getElementById('tool-container') as HTMLElement;
    menuNav = document.getElementById('menu') as HTMLElement;

    if (!menuToggle || !sidebar || !toolContainer || !menuNav) {
      console.warn('Required DOM elements not found during init');
      return;
    }

    const savedTheme = getSafeTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    initPrivacyBanner();

    renderMenu();
    injectThemeToggle();
    setupEventListeners();
    updateThemeIcon(savedTheme);
    handleRouting();
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function injectThemeToggle() {
  const topBar = document.getElementById('top-bar');
  if (topBar) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'icon-btn';
    toggleBtn.ariaLabel = 'Toggle Dark Mode';
    toggleBtn.textContent = '🌙';
    toggleBtn.style.marginRight = '10px';

    topBar.appendChild(toggleBtn);
  }
}

function renderMenu() {
  if (menuNav.querySelector('.menu-category')) {
    return;
  }

  const categories: Record<string, Tool[]> = {};

  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });

  const fragment = document.createDocumentFragment();

  for (const [category, categoryTools] of Object.entries(categories)) {
    const catDiv = document.createElement('div');
    catDiv.className = 'menu-category';

    const catTitle = document.createElement('h3');
    catTitle.textContent = category;
    catDiv.appendChild(catTitle);

    categoryTools.forEach(tool => {
      const link = document.createElement('a');
      link.href = `${BASE_URL}${tool.id}`;
      link.className = 'menu-item';
      link.textContent = tool.name;
      link.dataset.id = tool.id;
      catDiv.appendChild(link);
    });

    fragment.appendChild(catDiv);
  }

  menuNav.appendChild(fragment);

  const existingFooter = document.querySelector('.sidebar-footer');
  if (!existingFooter) {
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';

    footerLinks.forEach(page => {
      const link = document.createElement('a');
      link.href = `${BASE_URL}${page.id}`;
      link.className = 'footer-link';
      link.textContent = page.name;
      link.dataset.id = page.id;
      footer.appendChild(link);
    });

    if (sidebar) sidebar.appendChild(footer);
  }
}

function setupEventListeners() {
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (sidebar && window.innerWidth <= 768 && sidebar.classList.contains('open') && e.target instanceof Node) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('open');
      }
    }
  });

  document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && (target.matches('a.menu-item') || target.matches('a.footer-link') || target.closest('#logo-link'))) {
      e.preventDefault();
      const link = target.closest('a');
      const href = link ? link.getAttribute('href') : null;

      if (!href) return;

      if (window.location.pathname === href) {
        if (window.innerWidth <= 768 && sidebar) {
          sidebar.classList.remove('open');
        }
        return;
      }

      history.pushState(null, '', href);
      handleRouting();

      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
      }
    }
  });

  const topFeedbackBtn = document.getElementById('top-feedback-btn');
  if (topFeedbackBtn) {
    topFeedbackBtn.addEventListener('click', () => {
      history.pushState(null, '', `${BASE_URL}feedback`);
      handleRouting();
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
      const newTheme = currentTheme === 'dark' ? 'default' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  window.addEventListener('popstate', handleRouting);
}

function updateThemeIcon(theme: string) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function handleRouting() {
  const path = window.location.pathname;
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

  document.querySelectorAll('.menu-item, .footer-link').forEach(item => {
    const htmlItem = item as HTMLElement;
    const itemHref = htmlItem.getAttribute('href');
    htmlItem.classList.remove('active');
    if (itemHref === normalizedPath || itemHref === normalizedPath + '/') {
      htmlItem.classList.add('active');
    }
  });

  if (normalizedPath === BASE_URL || normalizedPath === '') {
    showWelcomeScreen();
    updateMetaTags();
    return;
  }

  const tool = tools.find(t => {
    const route = `${BASE_URL}${t.id}`.replace(/\/+/g, '/');
    return normalizedPath === route || normalizedPath === route + '/';
  });

  const footerPage = footerLinks.find(p => {
    const route = `${BASE_URL}${p.id}`.replace(/\/+/g, '/');
    return normalizedPath === route || normalizedPath === route + '/';
  });

  if (tool) {
    loadPage(tool);
    updateMetaTags(tool);
  } else if (footerPage) {
    loadPage(footerPage);
    updateMetaTags(footerPage);
  } else {
    if (toolContainer) toolContainer.innerHTML = '<h2>Page not found</h2>';
    updateMetaTags();
  }

  document.dispatchEvent(new Event('render-event'));
}

function updateMetaTags(tool?: Page) {
  const isHome = !tool;
  const title = isHome ? 'Simple Toolkit - Fast & Free Online Tools' : `${tool.title} | Simple Toolkit`;
  const description = isHome
    ? 'A collection of fast, lightweight, and free online tools including Age Calculator, Unit Converter, Random Number Generator, and more.'
    : tool.description;

  let absoluteUrl = SITE_URL;
  if (!isHome) {
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
    absoluteUrl = `${SITE_URL}${cleanBase}${tool.id}`.replace(/([^:]\/)\/+/g, "$1");
  } else if (!absoluteUrl.endsWith('/')) {
    absoluteUrl += '/';
  }

  document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', absoluteUrl);

  const props = {
    'og:title': title,
    'og:description': description,
    'og:url': absoluteUrl,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:url': absoluteUrl
  };

  for (const [prop, value] of Object.entries(props)) {
    updateMetaProp(prop, value);
  }
}

function updateMetaProp(property: string, content: string) {
  const isTwitter = property.startsWith('twitter:');
  const selector = isTwitter ? `meta[name="${property}"]` : `meta[property="${property}"]`;
  let element = document.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    if (isTwitter) {
      element.setAttribute('name', property);
    } else {
      element.setAttribute('property', property);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function showWelcomeScreen() {
  if (!toolContainer) return;
  const toolsHtml = tools.map(tool => `
    <a href="${BASE_URL}${tool.id}" class="tool-card glass animate-card" data-id="${tool.id}">
      <span class="tool-card-category">${tool.category}</span>
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
    </a>
  `).join('');

  toolContainer.innerHTML = `
        <div class="welcome-screen fade-in">
            <h2>Fast & Free Online Tools</h2>
            <p>Simple tools for everyday tasks. No sign-ups, no tracking, just utility.</p>
            <section class="tools-grid" aria-label="Available Tools">
                ${toolsHtml}
            </section>
        </div>
    `;

  toolContainer.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const href = (card as HTMLAnchorElement).getAttribute('href');
      if (href) {
        history.pushState(null, '', href);
        handleRouting();
      }
    });
  });
}

type ToolModule = {
  render: (container: HTMLElement) => void;
};

async function loadPage(page: Page) {
  if (!toolContainer) return;

  const existingWrapper = toolContainer.querySelector('.fade-in') as HTMLElement | null;
  if (existingWrapper && existingWrapper.dataset.pageId === page.id) {
    try {
      const { initAds, refreshAds } = await import('./utils/ad-manager');
      initAds();
      refreshAds();
    } catch (adError) {
      console.warn('Ad refresh failed:', adError);
    }
    return;
  }

  toolContainer.innerHTML = '<h2>Loading...</h2>';

  try {
    let module: ToolModule | undefined;
    if (page.id === 'age-calculator') {
      module = await import('./tools/age-calculator/index');
    } else if (page.id === 'random-number') {
      module = await import('./tools/random-number/index');
    } else if (page.id === 'unit-converter') {
      module = await import('./tools/unit-converter/index');
    } else if (page.id === 'stopwatch') {
      module = await import('./tools/stopwatch/index');
    } else if (page.id === 'qr-code-generator') {
      module = await import('./tools/qr-code-generator/index');
    } else if (page.id === 'option-picker') {
      module = await import('./tools/option-picker/index');
    } else if (page.id === 'privacy-policy') {
      module = await import('./tools/privacy-policy/index');
    } else if (page.id === 'about') {
      module = await import('./tools/about/index');
    } else if (page.id === 'feedback') {
      module = await import('./tools/feedback/index');
    } else if (page.id === 'watch-time-calculator') {
      module = await import('./tools/watch-time-calculator/index');
    } else if (page.id === 'will-it-fit') {
      module = await import('./tools/will-it-fit/index');
    }

    if (module && module.render) {
      toolContainer.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'fade-in';
      wrapper.dataset.pageId = page.id;
      toolContainer.appendChild(wrapper);
      module.render(wrapper);

      const isTool = tools.some(t => t.id === page.id);
      if (isTool) {
        (window as any).prevToolId = page.id;
      } else if (page.id !== 'feedback') {
        (window as any).prevToolId = undefined;
      }

      try {
        const { initAds, refreshAds } = await import('./utils/ad-manager');
        initAds();
        refreshAds();
      } catch (adError) {
        console.warn('Ad refresh failed:', adError);
      }
    }
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : String(e);
    toolContainer.innerHTML = `<p>Error loading tool: ${message}</p>`;
  }
}
