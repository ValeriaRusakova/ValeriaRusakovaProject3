import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export const getVacationLikesReport = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT v.destination, COUNT(l.user_id) AS likes
      FROM vacations v
      LEFT JOIN likes l ON l.vacation_id = v.vacation_id
      GROUP BY v.vacation_id, v.destination
      ORDER BY likes DESC, v.destination ASC
    `,
  );

  return rows.map((row) => ({
    destination: String(row.destination),
    likesCount: Number(row.likes ?? 0),
  }));
};

export const buildVacationLikesCsv = async () => {
  const rows = await getVacationLikesReport();
  const header = 'Destination,Likes';
  const body = rows.map((row) => `${row.destination.replace(/"/g, '""')},${row.likesCount}`).join('\n');
  return `${header}\n${body}`;
};
