import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/variables.css';
import './styles/global.css';

import { BASE_URL, type Page, type Tool, tools, footerLinks } from './config/pages-config';

const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
const sidebar = document.getElementById('sidebar') as HTMLElement;
const toolContainer = document.getElementById('tool-container') as HTMLElement;
const menuNav = document.getElementById('menu') as HTMLElement;

async function initPrivacyBanner() {
  try {
    const { initGoogleConsentMode, applySavedConsent } = await import('./utils/preferences');

    initGoogleConsentMode();

    applySavedConsent();

    // Custom banner is disabled to transition to Google Certified CMP
    // initCookieBanner();
  } catch (error: unknown) {
    // Privacy preferences logic failed to load
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Privacy preferences could not be initialized:', message);
  }
}

function init() {
  const savedTheme = localStorage.getItem('theme') || 'default';
  document.documentElement.setAttribute('data-theme', savedTheme);

  initPrivacyBanner();

  renderMenu();
  injectThemeToggle();
  setupEventListeners();
  updateThemeIcon(savedTheme);
  handleRouting();
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
  // Check if menu is already rendered (e.g. from static HTML)
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

  // Add footer with legal links if not present
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
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open') && e.target instanceof Node) {
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

      // Fix: Prevent re-rendering current page
      if (window.location.pathname === href) {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
        return;
      }

      history.pushState(null, '', href);
      handleRouting();

      if (window.innerWidth <= 768) {
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
  let path = window.location.pathname;

  // Handle routing for root path
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  // Handle trailing slash (e.g. /simple-tools/ -> path is empty)
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  document.querySelectorAll('.menu-item, .footer-link').forEach(item => {
    const htmlItem = item as HTMLElement;
    htmlItem.classList.remove('active');
    if (htmlItem.dataset.id === path) {
      htmlItem.classList.add('active');
    }
  });

  if (!path) {
    showWelcomeScreen();
    resetMetaTags();
    return;
  }

  const tool = tools.find(t => t.id === path);
  const footerPage = footerLinks.find(p => p.id === path);

  if (tool) {
    loadPage(tool);
    updateMetaTags(tool);
  } else if (footerPage) {
    loadPage(footerPage);
    updateMetaTags(footerPage);
  } else {
    toolContainer.innerHTML = '<h2>Page not found</h2>';
  }
}

function updateMetaTags(tool: Page) {
  document.title = `${tool.title} | Simple Toolkit`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", tool.description);
}

function resetMetaTags() {
  document.title = 'Simple Toolkit - Fast & Free Online Tools';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", "A collection of fast, lightweight, and free online tools including Age Calculator, Unit Converter, Random Number Generator, and more.");
}

function showWelcomeScreen() {
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
  // Hydration check: if the page is already rendered (e.g. via SSG), don't clear it
  const existingWrapper = toolContainer.querySelector('.fade-in') as HTMLElement | null;
  if (existingWrapper && existingWrapper.dataset.pageId === page.id) {
    // Page is already there, but we might still want to refresh ads or re-bind events
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
      module = await import('./tools/age-calculator');
    } else if (page.id === 'random-number') {
      module = await import('./tools/random-number');
    } else if (page.id === 'unit-converter') {
      module = await import('./tools/unit-converter');
    } else if (page.id === 'stopwatch') {
      module = await import('./tools/stopwatch');
    } else if (page.id === 'qr-code-generator') {
      module = await import('./tools/qr-code-generator');
    } else if (page.id === 'option-picker') {
      module = await import('./tools/option-picker');
    } else if (page.id === 'privacy-policy') {
      module = await import('./tools/privacy-policy');
    } else if (page.id === 'about') {
      module = await import('./tools/about');
    } else if (page.id === 'feedback') {
      module = await import('./tools/feedback');
    } else if (page.id === 'watch-time-calculator') {
      module = await import('./tools/watch-time-calculator');
    } else if (page.id === 'will-it-fit') {
      module = await import('./tools/will-it-fit');
    } else {
      setTimeout(() => {
        toolContainer.innerHTML = `
                    <h2>${page.name}</h2>
                    <div class="tool-content glass" style="padding: 20px; margin-top: 20px;">
                        <p>This tool is under construction.</p>
                    </div>
                `;
      }, 300);
      return;
    }

    if (module && module.render) {
      toolContainer.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'fade-in';
      wrapper.dataset.pageId = page.id; // Mark the wrapper for hydration
      toolContainer.appendChild(wrapper);
      module.render(wrapper);

      // Store current tool ID for feedback pre-selection
      const isTool = tools.some(t => t.id === page.id);
      if (isTool) {
        (window as any).prevToolId = page.id;
      } else if (page.id !== 'feedback') {
        (window as any).prevToolId = undefined;
      }

      // Refresh ads after tool is rendered
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

init();
