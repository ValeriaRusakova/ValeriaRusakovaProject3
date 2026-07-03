/**
 * Fix passwords in DB:
 *  - Detect users whose password is NOT a bcrypt hash (doesn't start with "$2")
 *  - Assign a unique password per user = firstName (lowercase) + "123"
 *  - Hash with bcrypt and update the row
 * Also prints a summary table of email -> new plaintext password.
 */

import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { pool } from './config/db';

interface UserRow extends RowDataPacket {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

async function main() {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT user_id, first_name, last_name, email, password FROM users',
  );

  const updates: Array<{ email: string; newPassword: string }> = [];

  for (const user of rows) {
    const isAlreadyHashed = typeof user.password === 'string' && user.password.startsWith('$2');
    if (isAlreadyHashed) continue;

    const cleanFirst = (user.first_name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    const newPlain = `${cleanFirst}123`;
    const hashed = await bcrypt.hash(newPlain, 10);

    await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashed, user.user_id]);
    updates.push({ email: user.email, newPassword: newPlain });
  }

  if (updates.length === 0) {
    console.log('All passwords are already hashed. Nothing to fix.');
  } else {
    console.log(`Fixed ${updates.length} user(s). New credentials:`);
    console.table(updates);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});
