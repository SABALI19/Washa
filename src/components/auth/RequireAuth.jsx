import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthSession from "../../hooks/useAuthSession.js";
import { getDashboardPathForRole } from "../../utils/auth.js";

const RequireAuth = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const session = useAuthSession();
  const userRole = session?.user?.role;

  if (!userRole) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
