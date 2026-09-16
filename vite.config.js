import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves this project below /yaplus-property-management/.
  // An explicit base keeps module and CSS requests inside that repository path.
  base: process.env.GITHUB_ACTIONS ? '/yaplus-property-management/' : '/',
  plugins: [react()],
});
