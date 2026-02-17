export function render(container) {
    container.innerHTML = `
    <h2>Privacy Policy</h2>
    <div class="tool-content glass privacy-policy-content">
      <p class="last-updated"><strong>Last Updated:</strong> February 17, 2026</p>
      
      <section>
        <h3>Introduction</h3>
        <p>Welcome to Simple Toolkit. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>
      </section>

      <section>
        <h3>Information We Collect</h3>
        <p>Simple Toolkit is designed to work entirely in your browser. We do not collect, store, or transmit any personal information you enter into our tools. All calculations and conversions happen locally on your device.</p>
        <p>However, we do collect certain non-personal information automatically through:</p>
        <ul>
          <li><strong>Cookies:</strong> Small text files stored on your device to improve your experience</li>
          <li><strong>Analytics:</strong> Anonymous usage data to help us understand how visitors use our site</li>
          <li><strong>Advertising:</strong> Information collected by third-party advertising partners</li>
        </ul>
      </section>

      <section>
        <h3>Google AdSense and Third-Party Advertising</h3>
        <p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and similar technologies to:</p>
        <ul>
          <li>Show you personalized ads based on your interests</li>
          <li>Measure ad performance and effectiveness</li>
          <li>Prevent fraud and abuse</li>
        </ul>
        <p>Google and its partners may collect and use data about your visits to this and other websites to provide advertisements about goods and services of interest to you. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</p>
        <p>For more information about how Google uses data, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's Privacy & Terms</a>.</p>
      </section>

      <section>
        <h3>Cookies</h3>
        <p>We use cookies to:</p>
        <ul>
          <li>Remember your preferences (such as theme settings)</li>
          <li>Understand how you use our website</li>
          <li>Serve relevant advertisements</li>
        </ul>
        <p>You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>
      </section>

      <section>
        <h3>Data Storage and Security</h3>
        <p>Any data you enter into our tools (such as dates, numbers, or units) is processed entirely in your browser and is not sent to our servers. We do not store or have access to this information.</p>
        <p>We use your browser's local storage to save preferences like your selected theme. This data remains on your device and can be cleared at any time through your browser settings.</p>
      </section>

      <section>
        <h3>Third-Party Links</h3>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
      </section>

      <section>
        <h3>Children's Privacy</h3>
        <p>Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>
      </section>

      <section>
        <h3>Your Rights</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access and review any personal data we may have</li>
          <li>Request deletion of your data</li>
          <li>Opt out of personalized advertising</li>
          <li>Control cookie settings through your browser</li>
        </ul>
      </section>

      <section>
        <h3>Changes to This Privacy Policy</h3>
        <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.</p>
      </section>

      <section>
        <h3>Contact Us</h3>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us through our website.</p>
      </section>
    </div>
    
    <style>
      .privacy-policy-content {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 12px;
        line-height: 1.6;
      }
      
      .privacy-policy-content .last-updated {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
      }
      
      .privacy-policy-content section {
        margin-bottom: 2rem;
      }
      
      .privacy-policy-content h3 {
        color: var(--accent-color);
        font-size: 1.3rem;
        margin-bottom: 0.75rem;
        margin-top: 0;
      }
      
      .privacy-policy-content p {
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
      
      .privacy-policy-content ul {
        margin: 0.5rem 0 1rem 1.5rem;
        color: var(--text-primary);
      }
      
      .privacy-policy-content li {
        margin-bottom: 0.5rem;
      }
      
      .privacy-policy-content a {
        color: var(--accent-color);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
      }
      
      .privacy-policy-content a:hover {
        border-bottom-color: var(--accent-color);
      }
      
      @media (max-width: 768px) {
        .privacy-policy-content {
          padding: 1.5rem;
        }
        
        .privacy-policy-content h3 {
          font-size: 1.1rem;
        }
      }
    </style>
  `;
}
