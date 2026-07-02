import type { ResultSetHeader } from 'mysql2';
import { pool } from '../config/db';
import type { AuthenticatedRequest } from '../middleware/auth';

export const likeVacation = async (user: NonNullable<AuthenticatedRequest['user']>, vacationId: number) => {
  if (user.role === 'admin') {
    return { status: 403, body: { message: 'Admins cannot like vacations' } };
  }

  try {
    await pool.query<ResultSetHeader>('INSERT INTO likes (user_id, vacation_id) VALUES (?, ?)', [user.id, vacationId]);
    return { status: 201, body: { message: 'Vacation liked' } };
  } catch {
    return { status: 409, body: { message: 'Vacation already liked' } };
  }
};

export const unlikeVacation = async (user: NonNullable<AuthenticatedRequest['user']>, vacationId: number) => {
  if (user.role === 'admin') {
    return { status: 403, body: { message: 'Admins cannot unlike vacations' } };
  }

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM likes WHERE user_id = ? AND vacation_id = ?', [user.id, vacationId]);

  if (result.affectedRows === 0) {
    return { status: 404, body: { message: 'Like not found' } };
  }

  return { status: 200, body: { message: 'Vacation unliked' } };
};
