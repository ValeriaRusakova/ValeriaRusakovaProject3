import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { VacationUpsertBody } from '../models/vacationTypes';
import { createVacation, deleteVacation, getVacationById, getVacations, updateVacation } from '../services/vacationService';

export const listVacations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await getVacations({
      page: typeof req.query.page === 'string' ? req.query.page : '1',
      filter: typeof req.query.filter === 'string' ? req.query.filter : 'all',
      userId: user.id,
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: 'Failed to load vacations' });
  }
};

export const vacationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const vacationId = Number(req.params.id);
    const vacation = await getVacationById(vacationId, user.id);

    if (!vacation) {
      res.status(404).json({ message: 'Vacation not found' });
      return;
    }

    res.json(vacation);
  } catch {
    res.status(500).json({ message: 'Failed to load vacation' });
  }
};

export const addVacation = async (req: Request<unknown, unknown, VacationUpsertBody>, res: Response): Promise<void> => {
  try {
    const result = await createVacation(req.body);
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Failed to create vacation' });
  }
};

export const editVacation = async (req: Request<{ id: string }, unknown, VacationUpsertBody>, res: Response): Promise<void> => {
  try {
    const result = await updateVacation(Number(req.params.id), req.body);
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Failed to update vacation' });
  }
};

export const removeVacation = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const result = await deleteVacation(Number(req.params.id));
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Failed to delete vacation' });
  }
};
