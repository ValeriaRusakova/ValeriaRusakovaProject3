import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import vacationRoutes from './routes/vacationRoutes';
import likeRoutes from './routes/likeRoutes';
import reportRoutes from './routes/reportRoutes';
import aiRoutes from './routes/aiRoutes';
import mcpRoutes from './routes/mcpRoutes';

const app = express();
const port = Number(process.env.PORT ?? '3000');

app.use(bodyParser.json());
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
