import jwt from 'jsonwebtoken';
import type { JwtUserPayload } from '../models/types';

const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-me';

export const signToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
};

export const verifyToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, jwtSecret) as JwtUserPayload;
};
