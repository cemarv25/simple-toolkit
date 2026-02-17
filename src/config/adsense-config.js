// Google AdSense Configuration
// Replace placeholder IDs with actual values after AdSense approval

export const ADSENSE_CONFIG = {
    publisherId: 'ca-pub-0000000000000000',
    adUnits: {
        sidebar: '0000000000',  // Sidebar ad slot ID
        bottom: '1111111111'    // Bottom ad slot ID
    },
    // Set to true once you have real publisher ID and ad unit IDs
    enabled: false,
    // Ad refresh settings for SPA
    refreshOnNavigation: true,
    fallbackMessages: {
        adBlocker: 'Ad blocked',
        noConsent: 'Ads disabled (no consent)',
        disabled: 'Ads not configured'
    }
};
