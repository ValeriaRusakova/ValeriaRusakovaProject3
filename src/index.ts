import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import vacationRoutes from './routes/vacationRoutes';
import likeRoutes from './routes/likeRoutes';
import reportRoutes from './routes/reportRoutes';
import aiRoutes from './routes/aiRoutes';
import mcpRoutes from './routes/mcpRoutes';

const app = express();
const port = Number(process.env.PORT ?? '3000');

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(bodyParser.json());

// Serve uploaded vacation images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mcp', mcpRoutes);

app.get('/', (_req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
