import type { Request, Response } from 'express';
import { buildVacationLikesCsv, getVacationLikesReport } from '../services/reportService';

export const vacationsLikesReport = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await getVacationLikesReport();
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to load report' });
  }
};

export const vacationsLikesCsv = async (_req: Request, res: Response): Promise<void> => {
  try {
    const csv = await buildVacationLikesCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vacations-likes.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ message: 'Failed to generate CSV' });
  }
};
