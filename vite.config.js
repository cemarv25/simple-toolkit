import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    return {
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
