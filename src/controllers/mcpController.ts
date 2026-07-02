import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export const answerMcpQuestion = async (req: Request, res: Response): Promise<void> => {
  const question = String(req.body?.question ?? '').toLowerCase();

  try {
    if (question.includes('כמה') && question.includes('פעילות')) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM vacations WHERE start_date <= CURDATE() AND end_date >= CURDATE()');
      res.json({ answer: `There are ${(rows[0] as RowDataPacket & { count: number } | undefined)?.count ?? 0} active vacations right now.` });
      return;
    }

    if (question.includes('ממוצע') && question.includes('מחיר')) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT AVG(price) AS avgPrice FROM vacations');
      res.json({ answer: `The average vacation price is ${Number((rows[0] as RowDataPacket & { avgPrice: number } | undefined)?.avgPrice ?? 0).toFixed(2)}.` });
      return;
    }

    if (question.includes('עתיד') || question.includes('future')) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT destination FROM vacations WHERE start_date > CURDATE() ORDER BY start_date ASC');
      res.json({ answer: rows.map((row) => (row as RowDataPacket & { destination: string }).destination).join(', ') || 'No upcoming vacations found.' });
      return;
    }

    res.json({ answer: 'I can answer questions about active vacations, average price, or upcoming vacations.' });
  } catch {
    res.status(500).json({ message: 'Failed to answer question' });
  }
};
