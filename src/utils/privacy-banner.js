// Cookie Banner UI Component
import {
  hasConsent,
  acceptAll,
  rejectAll,
  saveCustomPreferences,
  getSavedConsent
} from './preferences.js';

let bannerElement = null;
let modalElement = null;

// Create and inject the cookie banner HTML
export function createCookieBanner() {
  if (bannerElement) return; // Already created

  // Create banner
  bannerElement = document.createElement('div');
  bannerElement.className = 'cookie-banner';
  bannerElement.innerHTML = `
    <div class="cookie-banner-content">
      <div class="cookie-banner-text">
        <h3>🍪 We value your privacy</h3>
        <p>
          We use cookies to enhance your browsing experience, serve personalized ads, 
          and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
          <a href="/privacy-policy">Learn more</a>
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button class="cookie-btn cookie-btn-text" id="cookie-reject">Reject All</button>
        <button class="cookie-btn cookie-btn-secondary" id="cookie-customize">Customize</button>
        <button class="cookie-btn cookie-btn-primary" id="cookie-accept">Accept All</button>
      </div>
    </div>
  `;

  // Create customize modal
  modalElement = document.createElement('div');
  modalElement.className = 'cookie-modal-overlay';
  modalElement.innerHTML = `
    <div class="cookie-modal">
      <div class="cookie-modal-header">
        <h3>Cookie Preferences</h3>
        <button class="cookie-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="cookie-modal-body">
        <div class="cookie-category">
          <div class="cookie-category-header">
            <h4>Necessary Cookies</h4>
            <label class="cookie-toggle">
              <input type="checkbox" checked disabled>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            These cookies are essential for the website to function properly. 
            They enable basic features like page navigation and access to secure areas. 
            The website cannot function properly without these cookies.
          </p>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <h4>Analytics Cookies</h4>
            <label class="cookie-toggle">
              <input type="checkbox" id="toggle-analytics">
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            These cookies help us understand how visitors interact with our website 
            by collecting and reporting information anonymously. This helps us improve 
            the website's performance and user experience.
          </p>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <h4>Marketing Cookies</h4>
            <label class="cookie-toggle">
              <input type="checkbox" id="toggle-marketing">
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            These cookies are used to track visitors across websites and display 
            ads that are relevant and engaging. They may be set by us or by third-party 
            advertising partners (like Google AdSense).
          </p>
        </div>
      </div>
      <div class="cookie-modal-footer">
        <button class="cookie-btn cookie-btn-secondary" id="modal-cancel">Cancel</button>
        <button class="cookie-btn cookie-btn-primary" id="modal-save">Save Preferences</button>
      </div>
    </div>
  `;

  document.body.appendChild(bannerElement);
  document.body.appendChild(modalElement);

  // Set up event listeners
  setupEventListeners();
}

// Set up all event listeners for the banner and modal
function setupEventListeners() {
  // Banner buttons
  document.getElementById('cookie-accept').addEventListener('click', handleAcceptAll);
  document.getElementById('cookie-reject').addEventListener('click', handleRejectAll);
  document.getElementById('cookie-customize').addEventListener('click', showCustomizeModal);

  // Modal buttons
  document.getElementById('modal-save').addEventListener('click', handleSaveCustom);
  document.getElementById('modal-cancel').addEventListener('click', hideCustomizeModal);
  document.querySelector('.cookie-modal-close').addEventListener('click', hideCustomizeModal);

  // Close modal when clicking overlay
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      hideCustomizeModal();
    }
  });

  // Privacy policy link navigation
  bannerElement.querySelector('a[href="/privacy-policy"]').addEventListener('click', (e) => {
    e.preventDefault();
    hideBanner();
    hideCustomizeModal();
    history.pushState(null, '', '/privacy-policy');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

// Handle Accept All
function handleAcceptAll() {
  acceptAll();
  hideBanner();
}

// Handle Reject All
function handleRejectAll() {
  rejectAll();
  hideBanner();
}

// Show customize modal
function showCustomizeModal() {
  // Load current preferences if they exist
  const saved = getSavedConsent();
  if (saved) {
    document.getElementById('toggle-analytics').checked = saved.preferences.analytics;
    document.getElementById('toggle-marketing').checked = saved.preferences.marketing;
  }

  modalElement.classList.add('show');
}

// Hide customize modal
function hideCustomizeModal() {
  modalElement.classList.remove('show');
}

// Handle save custom preferences
function handleSaveCustom() {
  const analytics = document.getElementById('toggle-analytics').checked;
  const marketing = document.getElementById('toggle-marketing').checked;

  saveCustomPreferences(analytics, marketing);
  hideCustomizeModal();
  hideBanner();
}

// Show the banner with animation
export function showBanner() {
  if (!bannerElement) {
    createCookieBanner();
  }

  // Small delay to ensure CSS transition works
  setTimeout(() => {
    bannerElement.classList.add('show');
  }, 100);
}

// Hide the banner with animation
export function hideBanner() {
  if (bannerElement) {
    bannerElement.classList.remove('show');
  }
}

// Initialize banner (show if no consent exists)
export function initCookieBanner() {
  if (!hasConsent()) {
    showBanner();
  }
}

// Function to reopen banner (for privacy policy page)
export function reopenCookieBanner() {
  showBanner();
}
