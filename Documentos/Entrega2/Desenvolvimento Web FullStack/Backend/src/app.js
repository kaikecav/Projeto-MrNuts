import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_, res) => {
  res.json({ ok: true, server: 'TechFood API', version: '2.0.0' });
});

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;
