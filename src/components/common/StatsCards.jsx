import Card from "../Card";
import { TrendingUp } from "lucide-react";

const StatsCards = ({ title, value, change, subtitle, Icon, className = "" }) => {
  return (
    <Card
      className={`rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] text-slate-400">{title}</p>
          <p className="mt-4 text-[1.95rem] font-semibold tracking-[-0.03em] text-slate-900">
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        {change ? (
          <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-[#16a34a]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{change}</span>
          </div>
        ) : (
          <div />
        )}
        {subtitle && <p className="text-[0.72rem] text-slate-500">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default StatsCards;
