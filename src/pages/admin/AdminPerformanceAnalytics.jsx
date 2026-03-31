import {
  CalendarDays,
  Clock3,
  Download,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";

const rangeTabs = ["Day", "Week", "Month", "Quarter", "Year"];

const metrics = [
  {
    id: "orders",
    title: "Total Orders",
    value: "1,247",
    detail: "",
    change: "+18%",
    changeTone: "up",
    Icon: Package,
    showSparkline: true,
  },
  {
    id: "processing",
    title: "Avg Processing Time",
    value: "2.4h",
    detail: "vs 2.8h prev period",
    change: "-14%",
    changeTone: "down",
    Icon: Clock3,
  },
  {
    id: "retention",
    title: "Customer Retention",
    value: "87%",
    detail: "New: 23% | Returning: 77%",
    change: "+5%",
    changeTone: "up",
    Icon: UsersRound,
  },
  {
    id: "revenue",
    title: "Total Revenue",
    value: "$24,850",
    detail: "$19.93 per order",
    change: "+22%",
    changeTone: "up",
    Icon: DollarSign,
  },
];

const AdminPerformanceAnalytics = () => {
  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
              Performance Analytics
            </h1>
            <p className="mt-1.5 text-[0.78rem] text-slate-500">
              December 8 - December 15, 2024
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {rangeTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`rounded-xl px-4 py-2 text-[0.75rem] font-medium transition-colors ${
                  index === 0
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[0.75rem] font-medium text-slate-700"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Custom Range</span>
            </button>

            <Button
              variant="primary"
              size="md"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Report</span>
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card
              key={metric.id}
              className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] text-slate-400">{metric.title}</p>
                  <p className="mt-4 text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <metric.Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  {metric.showSparkline ? (
                    <MiniSparkline />
                  ) : (
                    <p className="text-[0.72rem] text-slate-500">{metric.detail}</p>
                  )}
                </div>
                <div
                  className={`inline-flex items-center gap-1 text-[0.72rem] font-medium ${
                    metric.changeTone === "down" ? "text-[#16a34a]" : "text-[#16a34a]"
                  }`}
                >
                  {metric.changeTone === "down" ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const MiniSparkline = () => {
  return (
    <div className="mt-1 overflow-hidden rounded-sm bg-slate-900/5">
      <svg
        viewBox="0 0 82 18"
        className="h-[18px] w-[82px]"
        role="img"
        aria-label="Orders trend"
      >
        <path
          d="M1 15 L12 11 L22 13 L31 8 L42 10 L53 5 L64 7 L81 2"
          fill="none"
          stroke="#111827"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1 18 H82 V8 L64 10 L53 7 L42 12 L31 10 L22 15 L12 13 L1 17 Z" fill="#111827" opacity="0.08" />
      </svg>
    </div>
  );
};

export default AdminPerformanceAnalytics;
