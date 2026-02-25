/// <reference types="vite/client" />

declare module "*.html?raw" {
    /**
     * Default export for .html?raw is the raw file content as a string.
     */
    const content: string;
    export default content;
}
