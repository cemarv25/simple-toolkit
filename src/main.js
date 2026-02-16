import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/variables.css';
import './styles/global.css';

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const toolContainer = document.getElementById('tool-container');
const menuNav = document.getElementById('menu');

const tools = [
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
];

function init() {
  const savedTheme = localStorage.getItem('theme') || 'default';
  document.documentElement.setAttribute('data-theme', savedTheme);

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
  const categories = {};

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
      link.href = `/${tool.id}`;
      link.className = 'menu-item';
      link.textContent = tool.name;
      link.dataset.id = tool.id;
      catDiv.appendChild(link);
    });

    fragment.appendChild(catDiv);
  }

  menuNav.appendChild(fragment);
}

function setupEventListeners() {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('open');
      }
    }
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a.menu-item')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');

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

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function handleRouting() {
  const path = window.location.pathname.slice(1);

  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.id === path) {
      item.classList.add('active');
    }
  });

  if (!path) {
    showWelcomeScreen();
    resetMetaTags();
    return;
  }

  const tool = tools.find(t => t.id === path);
  if (tool) {
    loadTool(tool);
    updateMetaTags(tool);
  } else {
    toolContainer.innerHTML = '<h2>Tool not found</h2>';
  }
}

function updateMetaTags(tool) {
  document.title = `${tool.title} | Lazy Tools`;
  document.querySelector('meta[name="description"]').setAttribute("content", tool.description);
}

function resetMetaTags() {
  document.title = 'Lazy Tools - Fast & Free Online Tools';
  document.querySelector('meta[name="description"]').setAttribute("content", "A collection of fast, lightweight, and free online tools including Age Calculator, Unit Converter, Random Number Generator, and more.");
}

function showWelcomeScreen() {
  toolContainer.innerHTML = `
        <div class="welcome-screen">
            <h2>Select a tool to get started</h2>
            <p>Choose a category from the sidebar.</p>
        </div>
    `;
}

async function loadTool(tool) {
  toolContainer.innerHTML = '<h2>Loading...</h2>';

  try {
    let module;
    if (tool.id === 'age-calculator') {
      module = await import('./tools/age-calculator.js');
    } else if (tool.id === 'random-number') {
      module = await import('./tools/random-number.js');
    } else if (tool.id === 'unit-converter') {
      module = await import('./tools/unit-converter.js');
    } else {
      setTimeout(() => {
        toolContainer.innerHTML = `
                    <h2>${tool.name}</h2>
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
      toolContainer.appendChild(wrapper);
      module.render(wrapper);
    }
  } catch (e) {
    console.error(e);
    toolContainer.innerHTML = `<p>Error loading tool: ${e.message}</p>`;
  }
}

init();
