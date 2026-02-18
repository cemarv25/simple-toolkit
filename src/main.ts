import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/variables.css';
import './styles/global.css';

const BASE_URL = '/';

type Page = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type Tool = Page & {
  category: string;
};

const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
const sidebar = document.getElementById('sidebar') as HTMLElement;
const toolContainer = document.getElementById('tool-container') as HTMLElement;
const menuNav = document.getElementById('menu') as HTMLElement;

const tools: Tool[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'Date & Time',
    title: 'Age Calculator - Exact Age in Years, Months, Days',
    description: 'Calculate your exact age in years, months, and days with this free and fast online Age Calculator.'
  },
  {
    id: 'random-number',
    name: 'Random Number',
    category: 'Math',
    title: 'Random Number Generator - Min/Max Range',
    description: 'Generate random numbers within a specific range instantly. Free online Random Number Generator.'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'Converters',
    title: 'Unit Converter - Length, Weight, Temperature',
    description: 'Convert between different units of measurement like Length, Weight, and Temperature easily.'
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    category: 'Date & Time',
    title: 'Online Stopwatch - Easy to Use with Laps',
    description: 'Simple and easy to use online stopwatch. Track laps and average times.'
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'Marketing',
    title: 'QR Code Generator - Create QR Codes for Links & Text',
    description: 'Create high-quality QR codes instantly for your website, links, or text. Secure and free online QR Code Generator.'
  },
  {
    id: 'option-picker',
    name: 'Option Picker',
    category: 'Math',
    title: 'Option Picker - Weighted Random Picker',
    description: 'Need help making a decision? Use our Option Picker to pick a random item from a list with custom weights.'
  },
];

const footerLinks: Page[] = [
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    title: 'Privacy Policy - Simple Toolkit',
    description: 'Privacy policy for Simple Toolkit, including information about cookies, Google AdSense, and data collection practices.'
  },
];

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
    toggleBtn.style.marginLeft = 'auto';
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
    if (target instanceof HTMLElement && (target.matches('a.menu-item') || target.matches('a.footer-link'))) {
      e.preventDefault();
      const href = target.getAttribute('href');

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
  toolContainer.innerHTML = `
        <div class="welcome-screen">
            <h2>Select a tool to get started</h2>
            <p>Choose a category from the sidebar.</p>
        </div>
    `;
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
