import { defineConfig } from 'wxt';
import path from 'path';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    resolve: {
      alias: {
        '@mediadock/shared': path.resolve(__dirname, '../../packages/shared/dist/index.mjs'),
        '@mediadock/validation': path.resolve(__dirname, '../../packages/validation/dist/index.mjs'),
      },
    },
  }),
  manifest: {
    name: 'MediaDock – Chat Media Manager',
    description: 'Organize and download media you are authorized to access through Telegram Web.',
    version: '1.0.0',
    permissions: ['sidePanel', 'downloads', 'storage', 'activeTab'],
    host_permissions: [
      'https://web.telegram.org/*',
      'https://k.telegram.org/*',
      'https://z.telegram.org/*',
      'https://api.mediadock.app/*',
    ],
    action: {
      default_title: 'Open MediaDock',
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
    commands: {
      _execute_action: {
        suggested_key: {
          default: 'Ctrl+Shift+M',
          mac: 'Command+Shift+M',
        },
        description: 'Open MediaDock SidePanel',
      },
      'download-current-media': {
        suggested_key: {
          default: 'Ctrl+Shift+D',
          mac: 'Command+Shift+D',
        },
        description: 'Download currently active media item',
      },
      'open-queue': {
        suggested_key: {
          default: 'Ctrl+Shift+Q',
          mac: 'Command+Shift+Q',
        },
        description: 'Open MediaDock Download Queue',
      },
    },
  },
});
