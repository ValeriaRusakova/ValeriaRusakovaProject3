import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Vacation, VacationResponse, VacationUpsertBody } from '../models/vacationTypes';
import type { JwtUserPayload } from '../models/types';
import { pool } from '../config/db';

type PaginationInput = {
  page?: string;
  filter?: string;
  userId: number;
};

type VacationRow = Vacation & RowDataPacket;
type LikesCountRow = RowDataPacket & { vacation_id: number; likesCount: number };
type LikeStateRow = RowDataPacket & { vacation_id: number };

const toVacationResponse = (vacation: VacationRow, likesCount = 0, isLiked = false): VacationResponse => ({
  vacation_id: vacation.vacation_id,
  destination: vacation.destination,
  description: vacation.description,
  start_date: vacation.start_date,
  end_date: vacation.end_date,
  price: vacation.price,
  image_filename: vacation.image_filename,
  created_at: vacation.created_at,
  likesCount,
  isLiked,
});

const validateVacationInput = (body: VacationUpsertBody, allowPastStartDate: boolean) => {
  const destination = body.destination?.trim();
  const description = body.description?.trim();
  const startDate = body.start_date;
  const endDate = body.end_date;
  const price = Number(body.price);

  if (!destination || !description || !startDate || !endDate || Number.isNaN(price)) {
    return { message: 'All fields are required' };
  }

  if (price < 0 || price > 10000) {
    return { message: 'Price must be between 0 and 10000' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { message: 'Invalid dates' };
  }

  if (end < start) {
    return { message: 'End date cannot be before start date' };
  }

  if (!allowPastStartDate && start < today) {
    return { message: 'Start date cannot be in the past' };
  }

  return null;
};

export const getVacations = async ({ page = '1', filter = 'all', userId }: PaginationInput) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limit = 9;
  const offset = (pageNumber - 1) * limit;

  let whereClause = '';
  let joins = '';
  const params: Array<string | number> = [];

  if (filter === 'liked') {
    joins = 'INNER JOIN likes l ON l.vacation_id = v.vacation_id AND l.user_id = ?';
    params.push(userId);
  } else if (filter === 'active') {
    whereClause = 'WHERE v.start_date <= CURDATE() AND v.end_date >= CURDATE()';
  } else if (filter === 'upcoming') {
    whereClause = 'WHERE v.start_date > CURDATE()';
  }

  const countQuery = `SELECT COUNT(*) AS total FROM vacations v ${joins} ${whereClause}`;
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
  const total = Number(countRows[0]?.total ?? 0);

  const listQuery = `
    SELECT v.*,
           COALESCE(lc.likesCount, 0) AS likesCount,
           CASE WHEN ul.user_id IS NULL THEN 0 ELSE 1 END AS isLiked
    FROM vacations v
    ${joins}
    LEFT JOIN (
      SELECT vacation_id, COUNT(*) AS likesCount
      FROM likes
      GROUP BY vacation_id
    ) lc ON lc.vacation_id = v.vacation_id
    LEFT JOIN likes ul ON ul.vacation_id = v.vacation_id AND ul.user_id = ?
    ${whereClause}
    ORDER BY v.start_date ASC
    LIMIT ? OFFSET ?
  `;

  const listParams = filter === 'liked'
    ? [userId, userId, limit, offset]
    : [userId, limit, offset];

  const [rows] = await pool.query<(VacationRow & LikesCountRow & LikeStateRow)[]>(listQuery, listParams);

  return {
    total,
    page: pageNumber,
    pages: Math.ceil(total / limit),
    vacations: rows.map((vacation) => toVacationResponse(vacation, Number((vacation as any).likesCount ?? 0), Boolean((vacation as any).isLiked))),
  };
};

export const getVacationById = async (vacationId: number, userId: number) => {
  const [rows] = await pool.query<(VacationRow & LikesCountRow & LikeStateRow)[]>(
    `
      SELECT v.*,
             COALESCE(lc.likesCount, 0) AS likesCount,
             CASE WHEN ul.user_id IS NULL THEN 0 ELSE 1 END AS isLiked
      FROM vacations v
      LEFT JOIN (
        SELECT vacation_id, COUNT(*) AS likesCount
        FROM likes
        GROUP BY vacation_id
      ) lc ON lc.vacation_id = v.vacation_id
      LEFT JOIN likes ul ON ul.vacation_id = v.vacation_id AND ul.user_id = ?
      WHERE v.vacation_id = ?
    `,
    [userId, vacationId],
  );

  const vacation = rows[0];
  if (!vacation) {
    return null;
  }

  return toVacationResponse(vacation, Number(vacation.likesCount ?? 0), Boolean(vacation.isLiked));
};

export const createVacation = async (body: VacationUpsertBody) => {
  const validationError = validateVacationInput(body, false);
  if (validationError) {
    return { status: 400, body: validationError };
  }

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)',
    [body.destination.trim(), body.description.trim(), body.start_date, body.end_date, body.price, body.image_filename ?? null],
  );

  return { status: 201, body: { vacationId: result.insertId } };
};

export const updateVacation = async (vacationId: number, body: VacationUpsertBody) => {
  const validationError = validateVacationInput(body, true);
  if (validationError) {
    return { status: 400, body: validationError };
  }

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = ? WHERE vacation_id = ?',
    [body.destination.trim(), body.description.trim(), body.start_date, body.end_date, body.price, body.image_filename ?? null, vacationId],
  );

  if (result.affectedRows === 0) {
    return { status: 404, body: { message: 'Vacation not found' } };
  }

  return { status: 200, body: { message: 'Vacation updated successfully' } };
};

export const deleteVacation = async (vacationId: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM vacations WHERE vacation_id = ?', [vacationId]);

  if (result.affectedRows === 0) {
    return { status: 404, body: { message: 'Vacation not found' } };
  }

  return { status: 200, body: { message: 'Vacation deleted successfully' } };
};
