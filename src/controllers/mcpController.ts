import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
interface VacationSummary extends RowDataPacket {
  vacation_id: number;
  destination: string;
  start_date: Date;
  end_date: Date;
  price: number | string;
}

interface VacationWithLikes extends VacationSummary {
  likesCount: number;
}

const hebrew = {
  active: '\u05e4\u05e2\u05d9\u05dc\u05d5\u05ea',
  activePlural: '\u05e4\u05e2\u05d9\u05dc\u05d9\u05dd',
  allDestinations: '\u05db\u05dc \u05d4\u05d9\u05e2\u05d3\u05d9\u05dd',
  averagePrice: '\u05de\u05de\u05d5\u05e6\u05e2 \u05de\u05d7\u05d9\u05e8',
  cheapest: '\u05d4\u05db\u05d9 \u05d6\u05d5\u05dc',
  cost: '\u05e2\u05dc\u05d5\u05ea',
  date: '\u05ea\u05d0\u05e8\u05d9\u05da',
  dates: '\u05ea\u05d0\u05e8\u05d9\u05db\u05d9\u05dd',
  destinations: '\u05d9\u05e2\u05d3\u05d9\u05dd',
  howMany: '\u05db\u05de\u05d4',
  howMuch: '\u05db\u05de\u05d4 \u05e2\u05d5\u05dc\u05d4',
  least: '\u05d4\u05db\u05d9 \u05e4\u05d7\u05d5\u05ea',
  like: '\u05dc\u05d9\u05d9\u05e7',
  likes: '\u05dc\u05d9\u05d9\u05e7\u05d9\u05dd',
  list: '\u05e8\u05e9\u05d9\u05de\u05ea',
  most: '\u05d4\u05db\u05d9 \u05d4\u05e8\u05d1\u05d4',
  mostExpensive: '\u05d4\u05db\u05d9 \u05d9\u05e7\u05e8',
  popular: '\u05d4\u05db\u05d9 \u05e4\u05d5\u05e4\u05d5\u05dc\u05e8\u05d9',
  price: '\u05de\u05d7\u05d9\u05e8',
  upcoming: '\u05e2\u05aa\u05d9\u05d3',
  vacations: '\u05d7\u05d5\u05e4\u05e9\u05d5\u05ea',
  when: '\u05de\u05ea\u05d9',
  whichDestinations: '\u05d0\u05d9\u05d6\u05d4 \u05d9\u05e2\u05d3\u05d9\u05dd',
};

const normalizeText = (value: string) => value.toLowerCase().replace(/[,.?!'":;()[\]{}_\-]+/g, ' ').replace(/\s+/g, ' ').trim();

const formatDate = (value: Date | string) => new Date(value).toLocaleDateString('en-GB');

const formatPrice = (value: number | string) => `$${Number(value).toLocaleString('en-US')}`;

const includesAny = (question: string, terms: string[]) => terms.some((term) => question.includes(normalizeText(term)));

const getMatchingDestination = async (question: string) => {
  const [rows] = await pool.query<VacationSummary[]>(
    'SELECT vacation_id, destination, start_date, end_date, price FROM vacations ORDER BY destination ASC',
  );

  return rows.find((vacation) => {
    const destination = normalizeText(vacation.destination);
  const city = normalizeText(vacation.destination.split(',')[0] ?? vacation.destination);
  const country = normalizeText(vacation.destination.split(',')[1] ?? '');

  return question.includes(destination)
    || (city.length > 2 && question.includes(city))
    || (country.length > 2 && question.includes(country));
  });
};

const getVacationWithLikes = async (order: 'ASC' | 'DESC') => {
  const [rows] = await pool.query<VacationWithLikes[]>(`
  SELECT v.vacation_id, v.destination, v.start_date, v.end_date, v.price, COUNT(l.user_id) AS likesCount
  FROM vacations v
  LEFT JOIN likes l ON v.vacation_id = l.vacation_id
  GROUP BY v.vacation_id, v.destination, v.start_date, v.end_date, v.price
  ORDER BY likesCount ${order}, v.destination ASC
  LIMIT 1
  `);

  return rows[0];
};

const getDestinationLikes = async (vacationId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS likesCount FROM likes WHERE vacation_id = ?',
    [vacationId],
  );
  return Number((rows[0] as RowDataPacket & { likesCount: number } | undefined)?.likesCount ?? 0);
};

export const answerMcpQuestion = async (req: Request, res: Response): Promise<void> => {
  const question = normalizeText(String(req.body?.question ?? ''));

  try {
    const matchedVacation = await getMatchingDestination(question);

    if (includesAny(question, ['most likes', 'most liked', 'highest likes', 'top likes', 'הכי הרבה', 'הכי פופולרי']) && includesAny(question, ['like', 'likes', 'liked', 'לייק', 'לייקים'])) {
      const top = await getVacationWithLikes('DESC');

      if (!top) {
        res.json({ answer: 'No vacations were found.' });
        return;
      }

      res.json({ answer: `${top.destination} has the most likes with ${top.likesCount} likes.` });
      return;
    }

    if (includesAny(question, ['least likes', 'fewest likes', 'lowest likes', 'הכי פחות']) && includesAny(question, ['like', 'likes', 'liked', 'לייק', 'לייקים'])) {
      const bottom = await getVacationWithLikes('ASC');

      if (!bottom) {
        res.json({ answer: 'No vacations were found.' });
        return;
      }

      res.json({ answer: `${bottom.destination} has the fewest likes with ${bottom.likesCount} likes.` });
      return;
    }

    if (includesAny(question, ['most expensive', 'highest price', 'יקר ביותר', 'הכי יקר'])) {
      const [rows] = await pool.query<VacationSummary[]>(
        'SELECT vacation_id, destination, start_date, end_date, price FROM vacations ORDER BY price DESC LIMIT 1',
      );
      const vacation = rows[0];

      if (!vacation) {
        res.json({ answer: 'No vacations were found.' });
        return;
      }

      res.json({ answer: `${vacation.destination} is the most expensive vacation at ${formatPrice(vacation.price)}.` });
      return;
    }

    if (includesAny(question, ['cheapest', 'lowest price', 'זול ביותר', 'הכי זול'])) {
      const [rows] = await pool.query<VacationSummary[]>(
        'SELECT vacation_id, destination, start_date, end_date, price FROM vacations ORDER BY price ASC LIMIT 1',
      );
      const vacation = rows[0];

      if (!vacation) {
        res.json({ answer: 'No vacations were found.' });
        return;
      }

      res.json({ answer: `${vacation.destination} is the cheapest vacation at ${formatPrice(vacation.price)}.` });
      return;
    }

    if (includesAny(question, ['average price', 'average cost', 'ממוצע מחיר', 'מחיר ממוצע'])) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT AVG(price) AS avgPrice FROM vacations');
      const avgPrice = Number((rows[0] as RowDataPacket & { avgPrice: number } | undefined)?.avgPrice ?? 0);
      res.json({ answer: `The average vacation price is ${formatPrice(avgPrice.toFixed(2))}.` });
      return;
    }

    if (matchedVacation && includesAny(question, ['cost', 'price', 'how much', 'כמה עולה', 'מחיר', 'עלות'])) {
      res.json({ answer: `${matchedVacation.destination} costs ${formatPrice(matchedVacation.price)}.` });
      return;
    }

    if (matchedVacation && includesAny(question, ['when', 'date', 'dates', 'start', 'end', 'מתי', 'תאריך', 'תאריכים'])) {
      res.json({ answer: `${matchedVacation.destination} is scheduled from ${formatDate(matchedVacation.start_date)} to ${formatDate(matchedVacation.end_date)}.` });
      return;
    }

    if (matchedVacation && includesAny(question, ['like', 'likes', 'liked', 'לייק', 'לייקים'])) {
      const likesCount = await getDestinationLikes(matchedVacation.vacation_id);
      res.json({ answer: `${matchedVacation.destination} has ${likesCount} likes.` });
      return;
    }

    if (matchedVacation) {
      res.json({ answer: `${matchedVacation.destination}: ${formatDate(matchedVacation.start_date)} to ${formatDate(matchedVacation.end_date)}, ${formatPrice(matchedVacation.price)}.` });
      return;
    }

    if (includesAny(question, ['how many', 'count', 'כמה']) && includesAny(question, ['active', 'פעילות', 'פעילים'])) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM vacations WHERE start_date <= CURDATE() AND end_date >= CURDATE()');
      res.json({ answer: `There are ${(rows[0] as RowDataPacket & { count: number } | undefined)?.count ?? 0} active vacations right now.` });
      return;
    }

    if (includesAny(question, ['how many', 'count', 'כמה']) && includesAny(question, ['vacations', 'destinations', 'חופשות', 'יעדים'])) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM vacations');
      res.json({ answer: `There are ${(rows[0] as RowDataPacket & { count: number } | undefined)?.count ?? 0} vacations in the database.` });
      return;
    }

    if (includesAny(question, ['upcoming', 'future', 'עתיד', 'קרוב', 'הבאות'])) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT destination FROM vacations WHERE start_date > CURDATE() ORDER BY start_date ASC');
      res.json({ answer: rows.map((row) => (row as RowDataPacket & { destination: string }).destination).join(', ') || 'No upcoming vacations found.' });
      return;
    }

    if (includesAny(question, ['list', 'show', 'which destinations', 'all destinations', 'רשימת', 'איזה יעדים', 'כל היעדים'])) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT destination FROM vacations ORDER BY destination ASC');
      res.json({ answer: rows.map((row) => (row as RowDataPacket & { destination: string }).destination).join(', ') || 'No vacations found.' });
      return;
    }

    res.json({ answer: 'I can answer database questions about vacation prices, dates, likes, destination lists, counts, upcoming vacations, cheapest vacation, and most expensive vacation.' });
  } catch (err) {
    console.error('MCP error:', err);
    res.status(500).json({ message: 'Failed to answer question' });
  }
};
