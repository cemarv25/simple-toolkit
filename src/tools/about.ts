import { tools } from '../config/pages-config';

export function render(container: HTMLElement) {
    container.innerHTML = `
    <div class="about-page fade-in">
      <h2>About Simple Toolkit</h2>
      
      <div class="tool-content glass">
        <section class="description">
          <p>
            Simple Toolkit is a collection of fast, lightweight, and free online tools designed to help you with 
            everyday tasks. No registrations, no complex interfaces—just the tools you need in one place.
          </p>
        </section>

        <section class="story">
          <h3>The Story</h3>
          <p>
            For years, I found myself bookmarking a multitude of different websites for simple tasks like calculating an age, 
            generating a QR code, or converting units. Every site was different, and some were slow.
          </p>
          <p>
            I eventually got tired of searching through my bookmarks or Googling the same tools over and over. 
            I built Simple Toolkit to solve my own problem: having all the essential tools I need in a single, 
            clean, and fast application.
          </p>
        </section>

        <section class="current-tools">
          <h3>Available Tools</h3>
          <ul id="about-tools-list">
            ${tools.map(t => `<li>${t.name}</li>`).join('')}
          </ul>
        </section>

        <div class="actions">
          <button id="about-feedback-btn" class="primary-btn">Provide Feedback</button>
        </div>
      </div>
    </div>

    <style>
      .about-page {
        max-width: 800px;
        margin: 0 auto;
        padding-bottom: 2rem;
      }
      .tool-content {
        padding: 2.5rem;
        border-radius: 16px;
      }
      section {
        margin-bottom: 2rem;
      }
      h3 {
        margin-bottom: 1rem;
        color: var(--accent-color);
        font-size: 1.5rem;
      }
      p {
        line-height: 1.6;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
      .current-tools ul {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .current-tools li {
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        font-weight: 500;
      }
      .actions {
        margin-top: 3rem;
        display: flex;
        justify-content: center;
      }
      .primary-btn {
        padding: 12px 30px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.1s, opacity 0.2s;
      }
      .primary-btn:hover {
        opacity: 0.9;
      }
      .primary-btn:active {
        transform: scale(0.98);
      }
    </style>
  `;

    const feedbackBtn = document.getElementById('about-feedback-btn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            history.pushState(null, '', '/feedback');
            const event = new PopStateEvent('popstate');
            window.dispatchEvent(event);
        });
    }
}
