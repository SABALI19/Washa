import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../components/Button";
import { useDashboardLayout } from "../DashboardLayout.jsx";
import useStaffDashboard from "../../hooks/useStaffDashboard.js";
import { resolveApiAssetUrl } from "../../utils/auth.js";
import QuickActions from "./QuickActions.jsx";
import Quickfilter from "./Quickfilter.jsx";
import ShiftInformation from "./ShiftInformation.jsx";
import TodaySummary from "./TodaySummary.jsx";

const emptyDashboard = {
  generatedAt: null,
  inProcessOrders: [],
  pendingVerificationOrders: [],
  pickupSections: [],
  quickActions: [],
  quickFilters: [],
  shiftInformation: {},
  summaryItems: [],
};

const formatHeaderTimestamp = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const filterPendingVerificationOrders = (orders, activeFilter) => {
  if (activeFilter === "all" || activeFilter === "pending") {
    return orders;
  }

  return [];
};

const filterInProcessOrders = (orders, activeFilter) => {
  if (activeFilter === "all" || activeFilter === "in-progress") {
    return orders;
  }

  return [];
};

const filterPickupSections = (sections, activeFilter) => {
  if (activeFilter === "all") {
    return sections;
  }

  return sections
    .map((section) => ({
      ...section,
      orders: section.orders.filter((order) => {
        if (activeFilter === "completed") {
          return order.statusKey === "completed";
        }

        if (activeFilter === "overdue") {
          return order.isOverdue;
        }

        return false;
      }),
    }))
    .filter((section) => section.orders.length > 0);
};

const StaffDashboard = () => {
  const dashboardLayout = useDashboardLayout();
  const setMobileSidebarContent = dashboardLayout?.setMobileSidebarContent;
  const closeMobileSidebar = dashboardLayout?.closeMobileSidebar;
  const { dashboard, error, isLoading } = useStaffDashboard();
  const [activeFilter, setActiveFilter] = useState("all");
  const resolvedDashboard = dashboard || emptyDashboard;
  const pendingVerificationOrders = useMemo(
    () => filterPendingVerificationOrders(resolvedDashboard.pendingVerificationOrders, activeFilter),
    [activeFilter, resolvedDashboard.pendingVerificationOrders],
  );
  const inProcessOrders = useMemo(
    () => filterInProcessOrders(resolvedDashboard.inProcessOrders, activeFilter),
    [activeFilter, resolvedDashboard.inProcessOrders],
  );
  const pickupSections = useMemo(
    () => filterPickupSections(resolvedDashboard.pickupSections, activeFilter),
    [activeFilter, resolvedDashboard.pickupSections],
  );
  const sidebarContent = useMemo(
    () => (
      <div className="space-y-6">
        <TodaySummary summaryItems={resolvedDashboard.summaryItems} />
        <Quickfilter
          activeFilter={activeFilter}
          filters={resolvedDashboard.quickFilters}
          onFilterChange={setActiveFilter}
        />
        <ShiftInformation {...resolvedDashboard.shiftInformation} />
        <QuickActions items={resolvedDashboard.quickActions} />
      </div>
    ),
    [
      activeFilter,
      resolvedDashboard.quickActions,
      resolvedDashboard.quickFilters,
      resolvedDashboard.shiftInformation,
      resolvedDashboard.summaryItems,
    ],
  );

  useEffect(() => {
    if (!setMobileSidebarContent) {
      return undefined;
    }

    setMobileSidebarContent(sidebarContent);

    return () => {
      setMobileSidebarContent(null);
      closeMobileSidebar?.();
    };
  }, [closeMobileSidebar, setMobileSidebarContent, sidebarContent]);

  return (
    <section className="mx-auto w-full max-w-[1450px]">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[1.85rem] font-semibold tracking-[-0.03em] text-slate-900">
              Staff Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-[0.95rem] text-slate-500">
                {formatHeaderTimestamp(resolvedDashboard.generatedAt) || "Dashboard unavailable"}
              </p>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--color-primary)]">
                Live Queue
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-[0.84rem] text-red-600">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mt-6 rounded-2xl bg-white px-4 py-5 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              Loading live staff dashboard data...
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.2rem] font-semibold text-slate-900">
                Pending Verification ({pendingVerificationOrders.length} orders)
              </h2>
              <button
                type="button"
                onClick={() => setActiveFilter("pending")}
                className="inline-flex items-center gap-2 text-[0.82rem] font-medium text-[var(--color-primary)]"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Focus Queue</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {pendingVerificationOrders.length > 0 ? (
                pendingVerificationOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[1.15rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[0.98rem] font-semibold text-slate-900">
                            #{order.id}
                          </h3>
                          <span className="text-[0.98rem] text-slate-500">
                            - {order.customer}
                          </span>
                          {order.rush && (
                            <span className="rounded-full bg-[var(--color-warm-soft)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[var(--color-primary)]">
                              RUSH
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[0.84rem] text-slate-500">
                          Submitted: {order.submittedAt}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.images.length > 0 ? (
                            order.images.map((image, index) => (
                              <div
                                key={`${order.id}-${index}`}
                                className="h-11 w-11 overflow-hidden rounded-lg bg-slate-100"
                              >
                                <img
                                  src={resolveApiAssetUrl(image)}
                                  alt={`${order.id} item ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg bg-slate-100 px-3 py-2 text-[0.72rem] text-slate-500">
                              No item photos yet
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.78rem] font-semibold text-[var(--color-primary)]">
                          {order.items} items
                        </span>
                        <Link to={`/staff/verification/${order.id}`}>
                          <Button
                            variant="primary"
                            size="md"
                            className="rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold"
                          >
                            Start Verification
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.15rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  No pending verification orders for the selected filter.
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              In Process ({inProcessOrders.length} orders)
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {inProcessOrders.length > 0 ? (
                inProcessOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[0.98rem] font-semibold text-slate-900">
                        #{order.id}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${order.badgeClassName}`}
                      >
                        {order.stage}
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 rounded-full bg-[var(--color-primary-soft)]">
                      <div
                        className="h-2.5 rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>

                    <p className="mt-3 text-[0.78rem] text-slate-500">
                      Last updated: {order.time}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                        {order.image ? (
                          <img
                            src={resolveApiAssetUrl(order.image)}
                            alt={order.id}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[0.62rem] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="md"
                        className="rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                      >
                        Update Status
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:col-span-2">
                  No in-process orders for the selected filter.
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              Scheduled Pickups
            </h2>

            <div className="mt-5 space-y-6">
              {pickupSections.length > 0 ? (
                pickupSections.map((section) => (
                  <div key={section.label}>
                    <h3 className="text-[0.95rem] font-semibold text-slate-900">
                      {section.label}
                    </h3>

                    <div className="mt-3 space-y-3">
                      {section.orders.map((order) => (
                        <article
                          key={`${section.label}-${order.id}`}
                          className="flex flex-col gap-4 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-[0.98rem] font-semibold text-slate-900">
                                #{order.id}
                              </h4>
                              <span className="text-[0.84rem] text-slate-500">
                                - {order.customer}
                              </span>
                            </div>
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-500">
                              <span>{order.items} items</span>
                              <span>&bull;</span>
                              <span>{order.time}</span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${order.statusClassName}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant={order.isActionActive ? "primary" : "secondary"}
                            size="md"
                            className={`self-start rounded-xl px-4 py-2 text-[0.78rem] font-semibold md:self-auto ${
                              order.isActionActive
                                ? ""
                                : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                            }`}
                          >
                            {order.actionLabel}
                          </Button>
                        </article>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  No scheduled pickups for the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden xl:block">
          {sidebarContent}
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
