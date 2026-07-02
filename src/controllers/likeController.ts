import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { likeVacation, unlikeVacation } from '../services/likeService';

export const addLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await likeVacation(req.user, Number(req.params.vacationId));
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Failed to like vacation' });
  }
};

export const removeLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await unlikeVacation(req.user, Number(req.params.vacationId));
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Failed to unlike vacation' });
  }
};
