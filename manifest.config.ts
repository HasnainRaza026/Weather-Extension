import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Weather Extension',
  version: '1.0.0',
  description: 'A simple weather extension using React and Vite',
  icons: {
    '16': 'icon.png',
    '48': 'icon.png',
    '128': 'icon.png',
  },
  action: {
    default_popup: 'src/popup/index.html',
  },
  content_scripts: [
    {
      matches: ['https://www.google.com/*'],
      js: ['src/content_script/index.tsx'],
    },
  ],
  background: {
    service_worker: 'src/background/index.ts',
  },
  permissions: ['storage', 'tabs', 'activeTab'],
  host_permissions: ['https://ip-api.com/*'],
});
