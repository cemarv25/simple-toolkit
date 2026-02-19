import { tools } from '../config/pages-config';

export function render(container: HTMLElement) {
  container.innerHTML = `
    <div class="feedback-page fade-in">
      <h2>Provide Feedback</h2>
      
      <div class="tool-content glass">
        <p class="intro-text">
          Have a suggestion, found a bug, or just want to say hi? We'd love to hear from you!
        </p>

        <form id="feedback-form">
          <div class="input-group">
            <label for="feedback-tool">What are you giving feedback about?</label>
            <select id="feedback-tool" required>
              <option value="general">General / Other</option>
              <option value="suggestion">New Tool Suggestion</option>
              ${tools.map(t => {
    const isSelected = t.id === (window as any).prevToolId;
    return `<option value="${t.id}" ${isSelected ? 'selected' : ''}>${t.name}</option>`;
  }).join('')}
            </select>
          </div>

          <div class="input-group">
            <label for="feedback-message">Your Message</label>
            <textarea id="feedback-message" rows="6" placeholder="Tell us what's on your mind..." required></textarea>
          </div>

          <button type="submit" id="send-feedback-btn" class="primary-btn">Send Message</button>
        </form>

        <div id="feedback-success" class="success-message hidden">
          <p>✨ Thank you for your feedback! We'll look into it soon.</p>
          <button id="back-home-btn" class="secondary-btn">Back to Tools</button>
        </div>
      </div>
    </div>

    <style>
      .feedback-page {
        max-width: 600px;
        margin: 0 auto;
        padding-bottom: 2rem;
      }
      .tool-content {
        padding: 2rem;
        border-radius: 16px;
      }
      .intro-text {
        margin-bottom: 2rem;
        color: var(--text-secondary);
        text-align: center;
      }
      .input-group {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-weight: 500;
      }
      select, textarea {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 1rem;
        width: 100%;
      }
      select option {
        background: var(--bg-color, #1a1a1a);
        color: var(--text-primary);
      }
      textarea {
        resize: vertical;
      }
      textarea::placeholder {
        color: var(--text-secondary);
        opacity: 0.8;
      }
      .primary-btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.1s;
        margin-top: 1rem;
      }
      .primary-btn:active {
        transform: scale(0.98);
      }
      .success-message {
        text-align: center;
        padding: 2rem 0;
      }
      .success-message p {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        color: var(--accent-color);
      }
      .hidden {
        display: none;
      }
      .secondary-btn {
        padding: 10px 20px;
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
      }
    </style>
  `;

  const form = document.getElementById('feedback-form') as HTMLFormElement;
  const successMsg = document.getElementById('feedback-success');
  const backBtn = document.getElementById('back-home-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate sending email
      console.log('Feedback submitted:', {
        tool: (document.getElementById('feedback-tool') as HTMLSelectElement).value,
        message: (document.getElementById('feedback-message') as HTMLTextAreaElement).value
      });

      form.classList.add('hidden');
      successMsg?.classList.remove('hidden');
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      history.pushState(null, '', '/');
      const event = new PopStateEvent('popstate');
      window.dispatchEvent(event);
    });
  }
}

