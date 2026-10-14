import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const port = parseInt(process.env.PORT || '8080', 10);
// Default to production mode for deployment unless explicitly set to 'development'
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Cardiff Taxis Next.js Server running on port ${port}`);
  });
});
