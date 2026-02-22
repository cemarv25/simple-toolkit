/**
 * Cloudflare Worker for Simple Toolkit
 * 
 * Functions:
 * 1. SPA Routing: Maps sub-paths (like /age-calculator) to the root index.html
 *    if the pre-rendered file is missing.
 * 2. Routing Safety Net: Ensures no 404s for clean URLs.
 * 3. TMDB API Proxy: Securely forwards requests to The Movie Database API
 *    using a hidden API key (TMDB_API_KEY).
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

        // 3. TMDB Proxy (Securely hides your API key)
        if (path.startsWith('/api/tmdb/')) {
            const tmdbPath = path.replace('/api/tmdb/', '');
            const tmdbUrl = new URL(`https://api.themoviedb.org/3/${tmdbPath}`);

            // Copy search params from original request (like query, page, etc.)
            url.searchParams.forEach((value, key) => {
                tmdbUrl.searchParams.set(key, value);
            });

            // Inject the private API Key from environment variables
            const apiKey = env.TMDB_API_KEY;
            if (!apiKey) {
                return new Response(JSON.stringify({ error: 'TMDB API Key not configured in Worker' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            tmdbUrl.searchParams.set('api_key', apiKey);

            return fetch(tmdbUrl.toString(), {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Simple-Toolkit-Cloudflare-Worker'
                }
            });
        }

        // 4. Fetch the requested path from your origin (GitHub Pages)
        // This will try to find the pre-rendered index.html in the directory
        // (e.g. /age-calculator/index.html)
        const response = await fetch(request);

        // 5. If GitHub Pages returns 404, fallback to the main index.html
        // This handles cases where a route isn't pre-rendered yet.
        if (response.status === 404) {
            const originUrl = new URL(url);
            originUrl.pathname = '/index.html';
            return fetch(originUrl.toString());
        }

        return response;
    },
};
