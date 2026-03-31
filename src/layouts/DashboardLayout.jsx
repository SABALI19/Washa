import { Outlet } from "react-router-dom";
import DashboardHeader from "../layouts/DashboardHeader.jsx";

const DashboardLayout = ({ headerVariant = "default", headerProps = {} }) => {
  return (
    <div className="min-h-screen b">
      <DashboardHeader variant={headerVariant} {...headerProps} />
      <main className="w-full mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
