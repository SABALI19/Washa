import Button from "../../components/Button";
import Card from "../../components/Card";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingDown,
} from "lucide-react";

const statusFilters = ["All", "Open", "In Review", "Resolved", "Closed"];

const disputes = [
  {
    id: "DIS-2024-001",
    priority: "High Priority",
    priorityClassName: "bg-[#fff1f2] text-[#dc2626]",
    status: "Open",
    statusClassName: "bg-[#fffbeb] text-[#a16207]",
    createdAt: "Dec 15, 2024 at 10:30 AM",
    customer: "Sarah Chen",
    orderId: "LT-2024-1280",
    type: "Lost Item",
    typeClassName: "bg-[#eff6ff] text-[#1d4ed8]",
    assignedTo: "Mike Johnson",
    description:
      "Customer claims missing white dress shirt from dry cleaning order. Item was documented during intake but not returned.",
    updatedAt: "2 hours ago",
  },
  {
    id: "DIS-2024-002",
    priority: "Medium Priority",
    priorityClassName: "bg-[#fff7ed] text-[#a16207]",
    status: "In Review",
    statusClassName: "bg-[#eff6ff] text-[#1d4ed8]",
    createdAt: "Dec 14, 2024 at 3:15 PM",
    customer: "James Wilson",
    orderId: "LT-2024-1278",
    type: "Damage",
    typeClassName: "bg-[#fff1f2] text-[#dc2626]",
    assignedTo: "Lisa Rodriguez",
    description:
      "Customer reports stain on cashmere sweater that wasn't there before cleaning. Photo evidence provided.",
    updatedAt: "5 hours ago",
  },
  {
    id: "DIS-2024-003",
    priority: "Low Priority",
    priorityClassName: "bg-slate-100 text-slate-600",
    status: "Resolved",
    statusClassName: "bg-[#ecfdf5] text-[#047857]",
    createdAt: "Dec 13, 2024 at 11:45 AM",
    customer: "Emma Davis",
    orderId: "LT-2024-1275",
    type: "Wrong Item",
    typeClassName: "bg-[#f5f3ff] text-[#7c3aed]",
    assignedTo: "Tom Anderson",
    description:
      "Customer received wrong size jacket. Issue resolved with exchange and apology voucher provided.",
    updatedAt: "1 day ago",
  },
];

const reasonLegend = [
  { label: "Lost Item", color: "#157f85" },
  { label: "Damage", color: "#1f9fa6" },
  { label: "Wrong Item", color: "#8dad8f" },
  { label: "Quality", color: "#6e8aa1" },
  { label: "Other", color: "#cbd5e1" },
];

const DisputeManagement = () => {
  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
              Dispute Management
            </h1>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
              12 Active
            </span>
          </div>

          <Button
            variant="secondary"
            size="md"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Disputes</span>
          </Button>
        </div>

        <Card className="mt-4 rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[0.78rem] font-semibold text-slate-900">Status:</span>
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[0.72rem] text-slate-500 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold text-slate-900">Priority:</span>
              <button
                type="button"
                className="flex min-w-[140px] items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-[0.72rem] text-slate-700"
              >
                <span>All Priorities</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold text-slate-900">Date Range:</span>
              <button
                type="button"
                className="flex min-w-[130px] items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-[0.72rem] text-slate-700"
              >
                <span>Last 7 days</span>
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold text-slate-900">Customer:</span>
              <input
                type="text"
                placeholder="Search customer..."
                className="min-w-[220px] rounded-xl border border-slate-200 px-3 py-2 text-[0.72rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold text-slate-900">Sort By:</span>
              <button
                type="button"
                className="flex min-w-[96px] items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-[0.72rem] text-slate-700"
              >
                <span>Newest</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-4">
          {disputes.map((dispute) => (
            <Card
              key={dispute.id}
              className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[1rem] font-semibold text-slate-900">
                      #{dispute.id}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${dispute.priorityClassName}`}
                    >
                      {dispute.priority}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${dispute.statusClassName}`}
                    >
                      {dispute.status}
                    </span>
                  </div>

                  <p className="mt-2 text-[0.72rem] text-slate-500">
                    Created: {dispute.createdAt}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  Review
                </Button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-[0.7rem] text-slate-500">Customer</p>
                  <p className="mt-1.5 text-[0.82rem] font-semibold text-slate-900">
                    {dispute.customer}
                  </p>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Order ID</p>
                  <p className="mt-1.5 text-[0.82rem] font-semibold text-[var(--color-primary)]">
                    #{dispute.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Type</p>
                  <span
                    className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${dispute.typeClassName}`}
                  >
                    {dispute.type}
                  </span>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Assigned to</p>
                  <p className="mt-1.5 text-[0.82rem] text-slate-900">{dispute.assignedTo}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-[0.78rem] leading-6 text-slate-800">
                  {dispute.description}
                </p>
                <p className="mt-2 text-[0.7rem] text-slate-500">
                  Last updated: {dispute.updatedAt}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[0.72rem] font-semibold text-white"
          >
            1
          </button>
          <button type="button" className="text-[0.75rem] text-slate-600">
            2
          </button>
          <button type="button" className="text-[0.75rem] text-slate-600">
            3
          </button>
          <span className="text-[0.75rem] text-slate-500">...</span>
          <button type="button" className="text-[0.75rem] text-slate-600">
            8
          </button>
          <button type="button" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">
              Average Resolution Time
            </h2>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-900">
                  2.3
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-[#16a34a]">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>-0.5 days</span>
                  <span className="font-normal text-slate-500">vs last month</span>
                </div>
              </div>
              <p className="pb-1 text-[0.78rem] text-slate-500">days</p>
            </div>
          </Card>

          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">
              Resolution Rate
            </h2>

            <div className="mt-4 space-y-3">
              {[
                ["Lost Item", "85%"],
                ["Damage", "92%"],
                ["Wrong Item", "98%"],
                ["Other", "89%"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-[0.78rem] text-slate-600">{label}</span>
                  <span className="text-[0.78rem] font-semibold text-slate-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">
              Common Reasons
            </h2>

            <div className="mt-4 flex justify-center">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background:
                    "conic-gradient(#157f85 0% 35%, #1f9fa6 35% 60%, #8dad8f 60% 82%, #6e8aa1 82% 94%, #cbd5e1 94% 100%)",
                }}
              >
                <div className="absolute inset-4 rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {reasonLegend.map((reason) => (
                <div key={reason.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: reason.color }}
                  />
                  <span className="text-[0.7rem] text-slate-600">{reason.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DisputeManagement;
