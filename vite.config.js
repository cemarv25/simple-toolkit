import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const VitePluginPrerender = require('vite-plugin-prerender');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            VitePluginPrerender({
                staticDir: path.join(__dirname, 'dist'),
                routes: [
                    '/',
                    '/age-calculator',
                    '/random-number',
                    '/unit-converter',
                    '/stopwatch',
                    '/qr-code-generator',
                    '/option-picker',
                    '/privacy-policy'
                ],
                rendererConfig: {
                    maxConcurrentRoutes: 4,
                    renderAfterTime: 500,
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                },
            }),
        ],
        build: {
            target: 'esnext',
            minify: 'esbuild',
            cssCodeSplit: true,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                    privacy: path.resolve(__dirname, 'src/pages/privacy-policy.html'),
                },
                output: {
                    manualChunks: {
                        // manually split vendor chunks if needed
                    }
                }
            }
        }
    };
});
