import Button from "../components/Button";
import { ArrowLeft, Bell, ChevronDown, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import washaLogo from "../assets/logo/washa-logo-blue.png";
import Profile from "../components/common/Profile";
import useAuthSession from "../hooks/useAuthSession.js";
import useNotifications from "../hooks/useNotifications.js";
import { useDashboardLayout } from "./DashboardLayoutContext.jsx";
import { getDashboardPathForRole } from "../utils/auth.js";

const defaultNavigationItems = [
  { name: "Dashboard", href: "/dashboard/customer" },
  { name: "Orders", href: "/orders" },
  { name: "Help", href: "/help" },
];

const formatNotificationTime = (value) => {
  if (!value) return "Recently";

  const elapsedMinutes = Math.max(
    Math.round((Date.now() - new Date(value).getTime()) / (60 * 1000)),
    1,
  );

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`;
  }

  return `${Math.round(elapsedHours / 24)}d ago`;
};

const DashboardHeader = ({
  user,
  variant = "default",
  brandLabel = "washa",
  navigationItems = defaultNavigationItems,
  backLink = "/dashboard/customer",
  backLabel = "Back to Dashboard",
  metaLabel,
  metaValue,
  metaValueFormatter,
  headerActionLabel,
  headerActionIcon: HeaderActionIcon,
  headerActionHasChevron = true,
  headerInlineContent,
  headerUtilityContent,
  showMobileHeaderUtility = true,
  showMobileSidebarButton = true,
  showNotificationBell = false,
  notificationCount = 0,
}) => {
  const location = useLocation();
  const { orderId } = useParams();
  const storedSession = useAuthSession();
  const {
    error: notificationError,
    isLoading: notificationsLoading,
    markAllRead,
    notifications,
    unreadCount,
  } = useNotifications();
  const dashboardLayout = useDashboardLayout();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isTrackingVariant = variant === "orderTracking";
  const resolvedNotificationCount = storedSession?.token ? unreadCount : notificationCount;
  const shouldShowNotificationBell = Boolean(storedSession?.token) || showNotificationBell;
  const resolvedUser =
    storedSession?.user || user
      ? {
          ...(user || {}),
          ...(storedSession?.user || {}),
          profileImage: storedSession?.user?.profileImage || user?.profileImage,
        }
      : undefined;
  const brandLink = getDashboardPathForRole(resolvedUser?.role);
  const resolvedMetaValue =
    metaValue ||
    (metaValueFormatter && orderId
      ? metaValueFormatter(orderId)
      : isTrackingVariant && orderId
        ? `#${orderId}`
        : undefined);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex min-w-0 items-center justify-between gap-3 py-3 sm:h-16 sm:py-0">
          <Link to={brandLink} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
            <img src={washaLogo} alt="washa logo" className="h-8 w-auto sm:h-10" />
            <span className="truncate text-sm font-bold text-gray-900">
              {brandLabel}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {isTrackingVariant ? (
              <div className="hidden items-center gap-8 md:flex">
                <Link
                  to={backLink}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#2c4a7d]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{backLabel}</span>
                </Link>

                {resolvedMetaValue && (
                  <p className="text-sm text-gray-500">
                    {metaLabel ? `${metaLabel}: ` : ""}
                    <span className="font-semibold text-gray-900">
                      {resolvedMetaValue}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <nav className="hidden space-x-1 md:flex">
              {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative overflow-hidden px-3 py-2 text-sm font-medium font-roboto transition-colors duration-300 ${
                      location.pathname === item.href
                        ? "text-[#2c4a7d]"
                        : "text-gray-600 hover:text-[#415a81]"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full bg-[#2c4a7d] transition-transform duration-300 ease-out ${
                        location.pathname === item.href
                          ? "translate-x-0"
                          : "-translate-x-full hover:translate-x-0"
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            )}
            {headerInlineContent && (
              <div className="hidden md:flex md:items-center">{headerInlineContent}</div>
            )}
            {headerUtilityContent && (
              <div className="hidden md:flex md:items-center">{headerUtilityContent}</div>
            )}
            {headerActionLabel && (
              <Button
                variant="secondary"
                size="md"
                className="hidden items-center gap-2 rounded-2xl border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:border-[var(--color-primary)] md:inline-flex"
              >
                {HeaderActionIcon && <HeaderActionIcon className="h-4 w-4" />}
                <span>{headerActionLabel}</span>
                {headerActionHasChevron && <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            {shouldShowNotificationBell && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((value) => !value)}
                  className="relative rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)] sm:p-2"
                  aria-label="Open notifications"
                >
                  <Bell className="h-5 w-5" />
                  {resolvedNotificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-semibold text-white">
                      {resolvedNotificationCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-[70] cursor-default bg-transparent"
                      aria-label="Close notifications"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="fixed left-3 right-3 top-[4.5rem] z-[80] max-h-[calc(100vh-5.5rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-[360px] sm:max-h-[420px]">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[0.9rem] font-semibold text-slate-900">
                          Notifications
                        </p>
                        <p className="text-[0.68rem] text-slate-500">
                          {resolvedNotificationCount} unread
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="shrink-0 rounded-lg px-2 py-1 text-[0.72rem] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain sm:max-h-[360px]">
                      {notificationsLoading && (
                        <div className="px-4 py-5 text-[0.78rem] text-slate-500">
                          Loading notifications...
                        </div>
                      )}

                      {notificationError && (
                        <div className="px-4 py-5 text-[0.78rem] text-red-500">
                          {notificationError}
                        </div>
                      )}

                      {!notificationsLoading && !notificationError && notifications.length === 0 && (
                        <div className="px-4 py-5 text-[0.78rem] text-slate-500">
                          No notifications yet.
                        </div>
                      )}

                      {!notificationsLoading &&
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                              notification.readAt ? "bg-white" : "bg-[#f6fbfc]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="break-words text-[0.8rem] font-semibold text-slate-900">
                                  {notification.title}
                                </p>
                                <p className="mt-1 break-words text-[0.74rem] leading-5 text-slate-600">
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.readAt && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                              )}
                            </div>
                            <p className="mt-2 text-[0.66rem] text-slate-400">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                  </>
                )}
              </div>
            )}
            <Profile user={resolvedUser} size="md" />
          </div>
        </div>

        {isTrackingVariant ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 py-3 md:hidden">
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#2c4a7d]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel}</span>
            </Link>
            {resolvedMetaValue && (
              <p className="text-sm text-gray-500">
                {metaLabel ? `${metaLabel}: ` : ""}
                <span className="font-semibold text-[#2c4a7d]">
                  {resolvedMetaValue}
                </span>
              </p>
            )}
          </div>
        ) : (
          <div className="py-2 md:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="scrollbar-hide flex min-w-0 flex-1 space-x-2 overflow-x-auto">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[0.78rem] font-medium ${
                      location.pathname === item.href
                        ? "bg-[#2c4a7d] text-white"
                        : "bg-gray-100 text-[#2c4a7d]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {headerInlineContent && <div>{headerInlineContent}</div>}
                {showMobileSidebarButton && dashboardLayout?.hasMobileSidebar && (
                  <button
                    type="button"
                    onClick={dashboardLayout.openMobileSidebar}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    aria-label="Open dashboard sidebar"
                  >
                    <PanelRightOpen className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            {showMobileHeaderUtility && headerUtilityContent && (
              <div className="mt-3">{headerUtilityContent}</div>
            )}
            {headerActionLabel && (
              <div className="mt-3 flex items-center gap-3">
                {headerActionLabel && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="inline-flex items-center gap-2 rounded-xl border-slate-200 text-sm text-slate-700 hover:border-[var(--color-primary)]"
                  >
                    {HeaderActionIcon && <HeaderActionIcon className="h-4 w-4" />}
                    <span>{headerActionLabel}</span>
                    {headerActionHasChevron && <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
