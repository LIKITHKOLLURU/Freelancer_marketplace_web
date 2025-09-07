import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component that restricts access based on authentication and roles.
 * @param {ReactNode} children - The protected component.
 * @param {string[]} roles - (Optional) Allowed roles to access the route.
 */
function PrivateRoute({ children, roles = [] }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
