import type { Request, Response } from 'express';
import fs from 'fs/promises';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { VacationUpsertBody } from '../models/vacationTypes';
import { createVacation, deleteVacation, getVacationById, getVacations, updateVacation } from '../services/vacationService';

type VacationFormBody = VacationUpsertBody & {
  startDate?: string;
  endDate?: string;
};

const normalizeVacationBody = (body: VacationFormBody, imageFilename?: string | null): VacationUpsertBody => {
  const normalized: VacationUpsertBody = {
    destination: body.destination,
    description: body.description,
    start_date: body.start_date ?? body.startDate ?? '',
    end_date: body.end_date ?? body.endDate ?? '',
    price: body.price,
  };

  if (imageFilename !== undefined) {
    normalized.image_filename = imageFilename;
  }

  return normalized;
};

const removeUploadedFile = async (file?: Express.Multer.File): Promise<void> => {
  if (!file?.path) return;

  try {
    await fs.unlink(file.path);
  } catch {
    // Best effort cleanup only; the validation response is more important.
  }
};

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

export const addVacation = async (req: Request<unknown, unknown, VacationFormBody>, res: Response): Promise<void> => {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      res.status(400).json({ message: 'Vacation photo is required' });
      return;
    }

    const body = normalizeVacationBody(req.body, file.filename);
    const result = await createVacation(body);
    if (result.status >= 400) {
      await removeUploadedFile(file);
    }
    res.status(result.status).json(result.body);
  } catch {
    await removeUploadedFile((req as Request & { file?: Express.Multer.File }).file);
    res.status(500).json({ message: 'Failed to create vacation' });
  }
};

export const editVacation = async (req: Request<{ id: string }, unknown, VacationFormBody>, res: Response): Promise<void> => {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file;
    const imageFilename = file ? file.filename : undefined;
    const body = normalizeVacationBody(req.body, imageFilename);
    const result = await updateVacation(Number(req.params.id), body);
    if (result.status >= 400) {
      await removeUploadedFile(file);
    }
    res.status(result.status).json(result.body);
  } catch {
    await removeUploadedFile((req as Request & { file?: Express.Multer.File }).file);
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
