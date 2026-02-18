/**
 * Cloudflare Worker for Simple Toolkit
 * 
 * Functions:
 * 1. SPA Routing: Maps sub-paths (like /age-calculator) to the root index.html
 *    if the pre-rendered file is missing.
 * 2. Routing Safety Net: Ensures no 404s for clean URLs.
 */

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 1. Serve static assets directly if they contain a dot (extensions like .js, .css, .svg)
        // and aren't root paths.
        if (path.includes('.') && path !== '/') {
            return fetch(request);
        }

        // 2. Handle the Privacy Policy route specially
        // Map clean URL to the nested file in the build output
        if (path === '/privacy-policy') {
            const originUrl = new URL(url);
            originUrl.pathname = '/src/pages/privacy-policy.html';
            return fetch(originUrl.toString());
        }

        // 3. Fetch the requested path from your origin (GitHub Pages)
        // This will try to find the pre-rendered index.html in the directory
        // (e.g. /age-calculator/index.html)
        const response = await fetch(request);

        // 3. If GitHub Pages returns 404, fallback to the main index.html
        // This handles cases where a route isn't pre-rendered yet.
        if (response.status === 404) {
            const originUrl = new URL(url);
            originUrl.pathname = '/index.html';
            return fetch(originUrl.toString());
        }

        return response;
    },
};
