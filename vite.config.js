import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/escala-1-1/', // este debe coincidir con el nombre de tu repo
  plugins: [react()],
});