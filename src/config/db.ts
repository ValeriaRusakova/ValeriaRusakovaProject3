import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'mysql',
  user: process.env.DB_USER ?? 'appuser',
  password: process.env.DB_PASSWORD ?? 'apppassword',
  database: process.env.DB_NAME ?? 'appdb',
  port: Number(process.env.DB_PORT ?? '3306'),
  waitForConnections: true,
  connectionLimit: 10,
});
