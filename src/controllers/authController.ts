import type { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authService';
import type { AuthLoginBody, AuthRegisterBody } from '../models/types';

export const register = async (req: Request<unknown, unknown, AuthRegisterBody>, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request<unknown, unknown, AuthLoginBody>, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
