// Redirects unauthenticated users to /login.
// Wrap any route that requires login.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  // Wait for localStorage to load before deciding
  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
