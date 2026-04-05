import Button from "../../components/Button";
import { AlertTriangle, QrCode, Search } from "lucide-react";

const iconMap = {
  issue: AlertTriangle,
  lookup: Search,
  scan: QrCode,
};

const fallbackQuickActionItems = [
  {
    count: 0,
    id: "scan",
    label: "Scan Order QR Code",
    variant: "primary",
  },
  {
    count: 0,
    id: "lookup",
    label: "Manual Order Lookup",
    variant: "secondary",
  },
  {
    count: 0,
    id: "issue",
    label: "Report Issue",
    variant: "secondary",
  },
];

const QuickActions = ({ items = fallbackQuickActionItems }) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-4 space-y-3">
        {items.map((action) => {
          const Icon = iconMap[action.id] || Search;

          return (
            <Button
              key={action.id}
              variant={action.variant}
              size="md"
              className={`flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-4 py-2.5 text-left text-[0.8rem] font-semibold ${
                action.variant === "primary"
                  ? ""
                  : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
              </span>
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[0.72rem] font-semibold">
                {action.count ?? 0}
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
