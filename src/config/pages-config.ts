export const BASE_URL = '/';
export const SITE_URL = 'https://www.simple-toolkit.com';

export type Page = {
    id: string;
    name: string;
    title: string;
    description: string;
};

export type Tool = Page & {
    category: string;
};

export const tools: Tool[] = [
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
    {
        id: 'stopwatch',
        name: 'Stopwatch',
        category: 'Date & Time',
        title: 'Online Stopwatch - Easy to Use with Laps',
        description: 'Simple and easy to use online stopwatch. Track laps and average times.'
    },
    {
        id: 'qr-code-generator',
        name: 'QR Code Generator',
        category: 'Marketing',
        title: 'QR Code Generator - Link to QR Code & URL Generator',
        description: 'Create unlimited high-quality QR codes for links and URLs instantly. Free, fast, and secure online QR Code Generator for your website or text.'
    },
    {
        id: 'option-picker',
        name: 'Option Picker',
        category: 'Math',
        title: 'Option Picker - Weighted Random Picker',
        description: 'Need help making a decision? Use our Option Picker to pick a random item from a list with custom weights.'
    },
    {
        id: 'watch-time-calculator',
        name: 'Watch Time',
        category: 'Entertainment',
        title: 'Watch Time Calculator - TV Shows & Movies',
        description: 'Calculate the total time needed to watch your favorite TV shows, anime, or movie collections.'
    },
    {
        id: 'will-it-fit',
        name: 'Will it Fit?',
        category: 'Home & Living',
        title: 'Will it Fit? - 3D Room Builder & Furniture Placement',
        description: 'Visualize if furniture will fit in your room with this interactive 3D tool. Support for custom room shapes and collision detection.'
    },
];

export const footerLinks: Page[] = [
    {
        id: 'about',
        name: 'About',
        title: 'About Simple Toolkit - Our Story',
        description: 'Learn about Simple Toolkit, why it was built, and the collection of free online tools available.'
    },
    {
        id: 'feedback',
        name: 'Feedback',
        title: 'Provide Feedback - Simple Toolkit',
        description: 'Share your thoughts, report bugs, or suggest new tools for Simple Toolkit.'
    },
    {
        id: 'privacy-policy',
        name: 'Privacy Policy',
        title: 'Privacy Policy - Simple Toolkit',
        description: 'Privacy policy for Simple Toolkit, including information about cookies, Google AdSense, and data collection practices.'
    },
];
