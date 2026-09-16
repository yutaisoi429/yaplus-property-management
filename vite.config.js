import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths allow the build to work under any GitHub repository name.
  base: './',
  plugins: [react()],
});
