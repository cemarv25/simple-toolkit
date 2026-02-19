// Ad Manager for Google AdSense
// Handles ad loading, refreshing, and consent integration
import { ADSENSE_CONFIG } from '../config/adsense-config';

type AdSenseUnit = Record<string, unknown>;

type GoogleFC = {
    showRevocationMessage: () => void;
};

declare global {
    interface Window {
        adsbygoogle: AdSenseUnit[] & { loaded?: boolean };
        googlefc?: GoogleFC;
    }
}

let adsInitialized = false;
let adElements: NodeListOf<HTMLElement> | undefined;

function canShowAds() {
    return ADSENSE_CONFIG.enabled;
}

export function initAds() {
    if (adsInitialized) return;

    if (!canShowAds()) {
        console.log('Ads disabled in adsense-config');
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn('Error initializing ad:', message);
        }
    });

    adsInitialized = true;
    console.log(`Initialized ${adElements?.length || 0} ad units. Google CMP will handle consent.`);
}

export function refreshAds() {
    if (!ADSENSE_CONFIG.refreshOnNavigation) return;

    if (!canShowAds()) return;

    const currentAdElements = document.querySelectorAll('.adsbygoogle') as NodeListOf<HTMLElement>;

    if (currentAdElements.length === 0) return;

    currentAdElements.forEach((element) => {
        try {
            element.innerHTML = '';
            delete element.dataset.adsbygoogleStatus;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn('Error refreshing ad:', message);
        }
    });

    console.log(`Refreshed ${currentAdElements.length} ad units`);
}

export function isAdBlockerActive() {
    return !window.adsbygoogle || window.adsbygoogle.loaded !== true;
}
