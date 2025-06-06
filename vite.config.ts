import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      browser: 'firefox',
      webExtConfig: {
        target: 'firefox-desktop',
        // firefoxBinary: process.env.FIREFOX_BINARY,
        // args: [
        //   '--start-debugger-server',
        //   // '--devtools',
        //   // '--jsconsole',
        //   '--remote-debugging-port=9222',
        // ],
      },
    }),
  ],
});
