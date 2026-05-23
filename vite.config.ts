import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STATIC_SITES: Record<string, string> = {
  '/credit-risk-model': path.resolve(__dirname, 'static-sites', 'credit-risk-model'),
  '/girsanov-explorer': path.resolve(__dirname, 'static-sites', 'girsanov-explorer'),
};

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

export default defineConfig({
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [
    react(),
    {
      name: 'serve-static-subdirs',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          for (const [prefix, dir] of Object.entries(STATIC_SITES)) {
            if (!url.startsWith(prefix + '/') && url !== prefix) continue;
            let relativePath = url.slice(prefix.length);
            if (!relativePath || relativePath === '/') relativePath = '/index.html';
            const filePath = path.join(dir, relativePath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath);
              res.statusCode = 200;
              res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
      closeBundle() {
        for (const [prefix, dir] of Object.entries(STATIC_SITES)) {
          const target = path.resolve(__dirname, 'dist', prefix.slice(1));
          if (fs.existsSync(target)) fs.rmSync(target, { recursive: true });
          fs.cpSync(dir, target, { recursive: true });
          console.log(`  Copied static site ${prefix} → dist${prefix}`);
        }
      },
    },
  ],
});
