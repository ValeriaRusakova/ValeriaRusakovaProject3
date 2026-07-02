import type { Request, Response } from 'express';

export const getRecommendation = async (req: Request, res: Response): Promise<void> => {
  const destination = String(req.body?.destination ?? '').trim();

  if (!destination) {
    res.status(400).json({ message: 'Destination is required' });
    return;
  }

  res.json({
    destination,
    recommendation: `For ${destination}, focus on local landmarks, food, and a 3-5 day itinerary.`,
  });
};
