// Ad Manager for Google AdSense
// Handles ad loading, refreshing, and consent integration

import { ADSENSE_CONFIG } from '../config/adsense-config.js';
import { getSavedConsent } from './preferences.js';

let adsInitialized = false;
let adElements = [];

function hasMarketingConsent() {
    try {
        const consent = getSavedConsent();
        return consent && consent.preferences && consent.preferences.marketing === true;
    } catch (error) {
        // If preferences module is blocked, assume no consent
        return false;
    }
}

function canShowAds() {
    return ADSENSE_CONFIG.enabled && hasMarketingConsent();
}

export function initAds() {
    if (adsInitialized) return;

    if (!canShowAds()) {
        console.log('Ads disabled:', !ADSENSE_CONFIG.enabled ? 'Not configured' : 'No marketing consent');
        showFallbackMessages();
        return;
    }

    adElements = document.querySelectorAll('.adsbygoogle');

    if (adElements.length === 0) {
        console.log('No ad slots found');
        return;
    }

    adElements.forEach((element) => {
        try {
            if (!element.dataset.adsbygoogleStatus) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            console.warn('Error initializing ad:', error);
        }
    });

    adsInitialized = true;
    console.log(`Initialized ${adElements.length} ad units`);
}

export function refreshAds() {
    if (!ADSENSE_CONFIG.refreshOnNavigation) return;

    if (!canShowAds()) {
        showFallbackMessages();
        return;
    }

    const currentAdElements = document.querySelectorAll('.adsbygoogle');

    if (currentAdElements.length === 0) return;

    currentAdElements.forEach((element) => {
        try {
            element.innerHTML = '';
            delete element.dataset.adsbygoogleStatus;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.warn('Error refreshing ad:', error);
        }
    });

    console.log(`Refreshed ${currentAdElements.length} ad units`);
}

function showFallbackMessages() {
    const adSlots = document.querySelectorAll('.ad-slot');

    adSlots.forEach((slot) => {
        const adElement = slot.querySelector('.adsbygoogle');
        if (!adElement) return;

        let message = '';

        if (!ADSENSE_CONFIG.enabled) {
            message = ADSENSE_CONFIG.fallbackMessages.disabled;
        } else if (!hasMarketingConsent()) {
            message = ADSENSE_CONFIG.fallbackMessages.noConsent;
        }

        if (message && !slot.querySelector('.ad-fallback')) {
            const fallback = document.createElement('p');
            fallback.className = 'ad-fallback';
            fallback.textContent = message;
            fallback.style.cssText = 'color: var(--text-secondary); font-size: 0.8rem; text-align: center; padding: 1rem;';
            slot.appendChild(fallback);
        }
    });
}

export function isAdBlockerActive() {
    return !window.adsbygoogle || window.adsbygoogle.loaded !== true;
}
