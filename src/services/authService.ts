import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import type { AuthLoginBody, AuthRegisterBody, User } from '../models/types';
import { signToken } from '../utils/jwt';

export const registerUser = async (body: AuthRegisterBody) => {
  const email = body.email.trim().toLowerCase();
  const firstName = body.firstName.trim();
  const lastName = body.lastName.trim();
  const password = body.password;

  if (!firstName || !lastName || !email || !password) {
    return { status: 400, body: { message: 'All fields are required' } };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: 400, body: { message: 'Invalid email format' } };
  }

  if (password.length < 4) {
    return { status: 400, body: { message: 'Password must be at least 4 characters long' } };
  }

  const [existingRows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  if (existingRows.length > 0) {
    return { status: 409, body: { message: 'Email already exists' } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query<any>(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, email, hashedPassword, 'user'],
  );

  const token = signToken({
    id: result.insertId,
    firstName,
    lastName,
    role: 'user',
  });

  return { status: 201, body: { token } };
};

export const loginUser = async (body: AuthLoginBody) => {
  const email = body.email.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return { status: 400, body: { message: 'Email and password are required' } };
  }

  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0] as User | undefined;

  if (!user) {
    return { status: 401, body: { message: 'Invalid email or password' } };
  }

  if (user.password === password) {
    const upgradedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [upgradedPassword, user.user_id]);
  } else {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, body: { message: 'Invalid email or password' } };
    }
  }

  const token = signToken({
    id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
  });

  return {
    status: 200,
    body: {
      token,
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        fullName: `${user.first_name} ${user.last_name}`,
      },
    },
  };
};
