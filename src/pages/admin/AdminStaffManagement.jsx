import { RefreshCw, UsersRound } from "lucide-react";

import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";
import useAdminStaffManagement from "../../hooks/useAdminStaffManagement.js";

const summaryCards = [
  { key: "totalStaff", label: "Total Staff" },
  { key: "onDutyCount", label: "On Duty" },
  { key: "offDutyCount", label: "Off Duty" },
];

const AdminStaffManagement = () => {
  const {
    error,
    isLoading,
    refreshStaffManagement,
    staffManagement,
  } = useAdminStaffManagement();
  const rows = staffManagement?.rows || [];
  const summary = staffManagement?.summary || {};

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[1.25rem] font-inter font-semibold tracking-normal text-[#2c4a7d] sm:text-[1.45rem] lg:text-[1.65rem] xl:text-[1.95rem]">
              Staff Management
            </h1>
            <p className="mt-1.5 text-[0.72rem] text-gray-500">
              Live attendance and staff duty status
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => refreshStaffManagement()}
            disabled={isLoading}
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.68rem] font-medium sm:px-4 sm:text-[0.75rem]"
          >
            <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${isLoading ? "animate-spin" : ""}`} />
            <span className="truncate">{isLoading ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            Loading staff management...
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3">
          {summaryCards.map((item) => (
            <Card
              key={item.key}
              className="rounded-[1rem] border-slate-100 p-3 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)] sm:p-4"
            >
              <p className="text-[0.68rem] text-slate-500 sm:text-[0.76rem]">{item.label}</p>
              <p className="mt-2 text-[1.35rem] font-semibold leading-none text-slate-900 sm:text-[1.8rem]">
                {summary[item.key] ?? 0}
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-4 rounded-[1.2rem] border-slate-100 p-0 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
            <UsersRound className="h-4 w-4 text-[var(--color-primary)]" />
            <h2 className="text-[1rem] font-semibold text-slate-900">Staff Roster</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((staff) => (
              <div
                key={staff.id}
                className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.9rem] font-semibold text-slate-900">
                    {staff.name}
                  </p>
                  <p className="mt-1 truncate text-[0.72rem] text-slate-500">{staff.email}</p>
                </div>

                <div className="min-w-0">
                  <p className="text-[0.7rem] text-slate-500">Clocked In</p>
                  <p className="mt-1 truncate text-[0.78rem] text-slate-700">
                    {staff.clockedInAtLabel}
                  </p>
                </div>

                <div className="flex items-center md:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                      staff.isOnDuty
                        ? "bg-[#ecfdf5] text-[#047857]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="px-4 py-6 text-[0.82rem] text-slate-500">
                No staff accounts found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminStaffManagement;
