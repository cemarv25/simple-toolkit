// Google AdSense Configuration

export type AdSenseConfig = {
    publisherId: string;
    adUnits: {
        sidebar: string;
        bottom: string;
    };
    enabled: boolean;
    refreshOnNavigation: boolean;
};

export const ADSENSE_CONFIG: AdSenseConfig = {
    publisherId: 'ca-pub-9833078254429629',
    adUnits: {
        sidebar: '4002459493',
        bottom: '9290445192'
    },
    enabled: true,
    refreshOnNavigation: true
};
