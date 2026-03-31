import Button from "../components/Button";
import { ArrowLeft, Bell, ChevronDown } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import washaLogo from "../assets/logo/washa-logo-blue.png";
import Profile from "../components/common/Profile";
import { getAuthSession, getDashboardPathForRole } from "../utils/auth.js";

const defaultNavigationItems = [
  { name: "Dashboard", href: "/dashboard/customer" },
  { name: "Orders", href: "/orders" },
  { name: "Help", href: "/help" },
];

const DashboardHeader = ({
  user,
  variant = "default",
  brandLabel = "Washa",
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
  showNotificationBell = false,
  notificationCount = 0,
}) => {
  const location = useLocation();
  const { orderId } = useParams();
  const storedSession = getAuthSession();
  const isTrackingVariant = variant === "orderTracking";
  const resolvedUser =
    storedSession?.user || user
      ? {
          ...(storedSession?.user || {}),
          ...(user || {}),
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={brandLink} className="flex items-center gap-2">
            <img src={washaLogo} alt="Washa Logo" className="h-10 w-auto" />
            <span className="text-sm font-semibold text-gray-900">
              {brandLabel}
            </span>
          </Link>

          <div className="flex items-center gap-4">
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
            {showNotificationBell && (
              <button
                type="button"
                className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            <Profile user={resolvedUser} size="md" />
          </div>
        </div>

        {isTrackingVariant ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 py-3 md:hidden">
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
          <div className="py-2 md:hidden">
            <div className="flex space-x-2 overflow-x-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ${
                    location.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {headerInlineContent && <div className="mt-3">{headerInlineContent}</div>}
            {headerUtilityContent && <div className="mt-3">{headerUtilityContent}</div>}
            {(headerActionLabel || showNotificationBell) && (
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
                {showNotificationBell && (
                  <button
                    type="button"
                    className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-semibold text-white">
                        {notificationCount}
                      </span>
                    )}
                  </button>
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
