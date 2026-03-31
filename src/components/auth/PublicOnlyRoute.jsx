import { Navigate, Outlet } from "react-router-dom";
import { getAuthSession, getDashboardPathForRole } from "../../utils/auth.js";

const PublicOnlyRoute = () => {
  const session = getAuthSession();
  const userRole = session?.user?.role;

  if (userRole) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
