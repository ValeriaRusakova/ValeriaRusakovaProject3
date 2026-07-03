// ── Reusable validation helpers ───────────────────────────────────────────────
// Each function returns an error string, or null if the value is valid.

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email format';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 4) return 'Password must be at least 4 characters';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}

export function validatePrice(price: number | string): string | null {
  const n = Number(price);
  if (isNaN(n)) return 'Price must be a number';
  if (n < 0) return 'Price cannot be negative';
  if (n > 10000) return 'Price cannot exceed $10,000';
  return null;
}

/**
 * @param allowPast - set to true in Edit Vacation (past dates are allowed)
 */
export function validateDates(
  startDate: string,
  endDate: string,
  allowPast = false,
): string | null {
  if (!startDate) return 'Start date is required';
  if (!endDate) return 'End date is required';

  if (!allowPast) {
    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) return 'Start date cannot be in the past';
  }

  if (endDate < startDate) return 'End date cannot be before start date';
  return null;
}
