import Button from "../../components/Button";
import { AlertTriangle, QrCode, Search } from "lucide-react";

const quickActionItems = [
  {
    id: "scan",
    label: "Scan Order QR Code",
    variant: "primary",
    Icon: QrCode,
  },
  {
    id: "lookup",
    label: "Manual Order Lookup",
    variant: "secondary",
    Icon: Search,
  },
  {
    id: "issue",
    label: "Report Issue",
    variant: "secondary",
    Icon: AlertTriangle,
  },
];

const QuickActions = () => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-4 space-y-3">
        {quickActionItems.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="md"
            className={`flex w-full items-center justify-center gap-2.5 rounded-[0.9rem] px-4 py-2.5 text-[0.8rem] font-semibold ${
              action.variant === "primary"
                ? ""
                : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            }`}
          >
            <action.Icon className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
