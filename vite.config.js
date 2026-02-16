import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    // TODO: When changing to custom domain, set base to '/'
    const base = isProduction ? '/simple-tools/' : '/';

    return {
        base,
        build: {
            target: 'esnext',
            minify: 'esbuild',
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        // manually split vendor chunks if needed, but for now defaults are fine
                    }
                }
            }
        }
    };
});
