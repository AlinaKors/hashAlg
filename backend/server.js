import express from 'express';
import next from 'next';
import cors from 'cors';
import crypto from 'crypto';

const dev = process.env.NODE_ENV !== 'production';
const appNext = next({ dev, dir: '../frontend/src' });
const handle = appNext.getRequestHandler();

appNext
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(express.json());

    server.post('/api/hash', (req, res) => {
      const { algoritm, value } = req.body;

      if (!algoritm || !value) {
        return res.status(400).json({ error: 'Missing algoritm or value' });
      }

      try {
        const hash = crypto.createHash(algoritm).update(value).digest('hex');
        res.json({ hash });
      } catch (err) {
        console.error('Hashing error:', err);
        res.status(400).json({ error: 'Invalid algorithm' });
      }
    });

    server.use((req, res) => handle(req, res));

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`> Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Next.js preparation failed:', err);
  });
