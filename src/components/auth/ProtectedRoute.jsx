import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Renders children only when there's a signed-in user.
// Sends visitors without a session to /sign-in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // brief flash while we read the session
  if (!user) return <Navigate to="/sign-in" replace />;
  return children;
}
