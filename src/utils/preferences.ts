// Cookie Consent Management with Google Consent Mode v2
// Handles user consent preferences and integrates with Google's consent framework

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (command: string, ...args: unknown[]) => void;
    }
}

const CONSENT_VERSION = '1.0';
const CONSENT_KEY = 'cookieConsent';

type ConsentPreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

type ConsentData = {
    timestamp: number;
    version: string;
    preferences: ConsentPreferences;
};

// Initialize Google Consent Mode v2
export function initGoogleConsentMode() {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push(args);
        }
    }
    window.gtag = gtag as (...args: unknown[]) => void;

    // Set default consent to 'denied' as per GDPR requirements
    window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'wait_for_update': 500
    });

    window.gtag('set', 'ads_data_redaction', true);
}

// Get saved consent preferences from localStorage
export function getSavedConsent(): ConsentData | null {
    try {
        const saved = localStorage.getItem(CONSENT_KEY);
        if (!saved) return null;

        const consent = JSON.parse(saved) as ConsentData;

        // Validate version
        if (consent.version !== CONSENT_VERSION) {
            return null;
        }

        return consent;
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error reading consent:', message);
        return null;
    }
}

// Save consent preferences to localStorage
export function saveConsent(preferences: Partial<ConsentPreferences>) {
    const consent: ConsentData = {
        timestamp: Date.now(),
        version: CONSENT_VERSION,
        preferences: {
            necessary: true, // Always true
            analytics: preferences.analytics || false,
            marketing: preferences.marketing || false
        }
    };

    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        updateGoogleConsent(consent.preferences);
        return true;
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error saving consent:', message);
        return false;
    }
}

// Update Google Consent Mode based on user preferences
export function updateGoogleConsent(preferences: ConsentPreferences) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('consent', 'update', {
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'ad_user_data': preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': preferences.marketing ? 'granted' : 'denied',
        'analytics_storage': preferences.analytics ? 'granted' : 'denied'
    });
}

// Accept all cookies
export function acceptAll() {
    return saveConsent({
        analytics: true,
        marketing: true
    });
}

// Reject all optional cookies (keep only necessary)
export function rejectAll() {
    return saveConsent({
        analytics: false,
        marketing: false
    });
}

// Save custom preferences
export function saveCustomPreferences(analytics: boolean, marketing: boolean) {
    return saveConsent({
        analytics: analytics,
        marketing: marketing
    });
}

// Check if user has made a consent choice
export function hasConsent() {
    return getSavedConsent() !== null;
}

// Apply saved consent on page load
export function applySavedConsent() {
    const saved = getSavedConsent();
    if (saved) {
        updateGoogleConsent(saved.preferences);
        return true;
    }
    return false;
}

// Reset consent (for testing or user request)
export function resetConsent() {
    try {
        localStorage.removeItem(CONSENT_KEY);
        return true;
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error('Error resetting consent:', message);
        return false;
    }
}
