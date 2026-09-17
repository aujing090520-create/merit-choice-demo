import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '/Users/sequoia/Documents/Codex-Workspace/临时项目/ht-photo-exchange-demo/public/ht'
      ]
    }
  }
});
