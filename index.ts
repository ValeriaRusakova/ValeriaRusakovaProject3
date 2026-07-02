import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';

const app = express();
app.use(bodyParser.json());
const port = 3000;

type VacationInput = {
  destination?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number | string;
  image_filename?: string;
};

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'mysql',
  user: process.env.DB_USER ?? 'appuser',
  password: process.env.DB_PASSWORD ?? 'apppassword',
  database: process.env.DB_NAME ?? 'appdb',
  port: Number(process.env.DB_PORT ?? '3306'),
  waitForConnections: true,
  connectionLimit: 10,
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with Express and TypeScript!');
});

app.get('/health/db', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
    });
  }
});

app.get('/vacations', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vacations');
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to read vacations table',
    });
  }
});

app.post('/vacations', async (req: Request<unknown, unknown, VacationInput>, res: Response) => {
  const { destination, description, start_date, end_date, price, image_filename } = req.body;

  if (!destination || !description || !start_date || !end_date || price === undefined || !image_filename) {
    res.status(400).json({
      message: 'Missing required fields',
    });
    return;
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)',
      [destination, description, start_date, end_date, price, image_filename],
    );

    res.status(201).json({
      message: 'Vacation created successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create vacation',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
