// Allows access only to admin users.
// Non-admins are redirected to /vacations.
// Unauthenticated users are redirected to /login.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/vacations" replace />;

  return <>{children}</>;
}
