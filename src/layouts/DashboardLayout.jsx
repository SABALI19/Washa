import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardHeader from "../layouts/DashboardHeader.jsx";

const DashboardLayoutContext = createContext(null);

export const useDashboardLayout = () => useContext(DashboardLayoutContext);

const DashboardLayout = ({ headerVariant = "default", headerProps = {} }) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileSidebarContent, setMobileSidebarContent] = useState(null);
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);
  const openMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);
  const hasMobileSidebar = Boolean(mobileSidebarContent);

  const layoutValue = useMemo(
    () => ({
      closeMobileSidebar,
      hasMobileSidebar,
      isMobileSidebarOpen,
      openMobileSidebar,
      setMobileSidebarContent,
    }),
    [closeMobileSidebar, hasMobileSidebar, isMobileSidebarOpen, openMobileSidebar],
  );

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setMobileSidebarContent(null);
  }, [location.pathname]);

  return (
    <DashboardLayoutContext.Provider value={layoutValue}>
      <div className="min-h-screen">
        <DashboardHeader variant={headerVariant} {...headerProps} />
        <main className="mx-auto w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:p-8">
          <Outlet />
        </main>

        {mobileSidebarContent && (
          <div
            className={`fixed inset-0 z-[70] xl:hidden ${
              isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!isMobileSidebarOpen}
          >
            <button
              type="button"
              onClick={closeMobileSidebar}
              className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity ${
                isMobileSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Close staff sidebar"
            />
            <aside
              className={`absolute right-0 top-0 h-full w-[min(88vw,320px)] overflow-y-auto bg-[var(--color-surface)] p-4 shadow-[-16px_0_40px_rgba(15,23,42,0.16)] transition-transform ${
                isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {mobileSidebarContent}
            </aside>
          </div>
        )}
      </div>
    </DashboardLayoutContext.Provider>
  );
};

export default DashboardLayout;
