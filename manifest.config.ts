import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Weather Extension',
  version: '1.0.0',
  action: {
    default_popup: 'src/popup/index.html',
  },
});
