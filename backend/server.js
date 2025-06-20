import express from 'express';
import next from 'next';
import cors from 'cors';
import crypto from 'crypto';
import { Pool } from 'pg';

const dev = process.env.NODE_ENV !== 'production';
const appNext = next({ dev, dir: '../frontend/src' });
const handle = appNext.getRequestHandler();

const db = new Pool({
  user: 'postgres', // Пользователь базы данных
  host: 'localhost', // Хост базы данных (обычно localhost)
  database: 'postgres', // Название базы данных, которую мы создали
  password: '1', // Пароль пользователя postgres
  port: 5432, // Порт PostgreSQL (по умолчанию 5432)
});

appNext
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(express.json());

    server.post('/api/audit', async (req, res) => {
      const { userId, action, name, email, role } = req.body;

      try {
        await db.query(
          `INSERT INTO audit_logs (user_id, user_name, user_email, user_role, action)
       VALUES ($1, $2, $3, $4, $5)`,
          [userId, name, email, role, action],
        );
        res.status(200).json({ status: 'ok' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log audit event' });
      }
    });

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
