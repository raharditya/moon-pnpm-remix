import 'dotenv/config';

import path from 'node:path';
import url from 'node:url';
import express, { Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { installGlobals } from '@remix-run/node';
import { createRequestHandler } from '@remix-run/express';

installGlobals();

const port = Number(process.env.PORT) || 3000;

const vite =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then(({ createServer }) => createServer({ server: { middlewareMode: true } }));
const remix = createRequestHandler({
  build: vite
    ? () => vite.ssrLoadModule('virtual:remix/server-build')
    : // @ts-expect-error
      await import('./server/index.js'),
});

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// assets
if (vite) {
  app.use(vite.middlewares);
} else {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const client = path.resolve(__dirname, 'client');
  app.use('/public/assets', express.static(path.join(client, 'assets'), { immutable: true, maxAge: '1y' }));
  app.use('/public', express.static(client, { maxAge: '1h' }));
}

app.get(['/app/*'], (req, res) => {
  return res.status(404).send('Not found');
});

// log
app.use(morgan('tiny'));

app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

// main
app.get('*', async (req, res, next) => {
  return next();
});
app.all('*', remix);

app.on('error', (err) => {
  console.log(err);
});

const server = app.listen(port, () => console.log(`http://localhost:${port}`));

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.once(signal, () => server.close(console.error));
});
