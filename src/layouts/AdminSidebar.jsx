import BussinessInformation from "../components/common/BussinessInformation.jsx";
import Card from "../components/Card";
import {
  BarChart3,
  LayoutGrid,
  OctagonAlert,
  Package,
  Settings,
  UsersRound,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", Icon: LayoutGrid, active: true },
  { label: "All Orders", Icon: Package, active: false },
  { label: "Disputes", Icon: OctagonAlert, active: false },
  { label: "Performance Analytics", Icon: BarChart3, active: false },
  { label: "Staff Management", Icon: UsersRound, active: false },
  { label: "System Settings", Icon: Settings, active: false },
];

const ranges = [
  { label: "Today", active: true },
  { label: "Week", active: false },
  { label: "Month", active: false },
  { label: "Year", active: false },
  { label: "Custom Range", active: false, fullWidth: true },
];

const AdminSidebar = () => {
  return (
    <aside className="w-full max-w-[270px] space-y-4">
      <div>
        <h2 className="text-[0.82rem] font-semibold text-slate-900">
          Navigation
        </h2>

        <div className="mt-3 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                item.active
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <item.Icon className="h-3.5 w-3.5" />
              <span className="text-[0.76rem] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-[1.1rem] border-slate-100 p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
        <h2 className="text-[0.82rem] font-semibold text-slate-900">
          Date Range
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {ranges.map((range) => (
            <button
              key={range.label}
              type="button"
              className={`rounded-xl px-3 py-2 text-[0.76rem] font-medium transition-colors ${
                range.active
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-slate-100 text-slate-600"
              } ${range.fullWidth ? "col-span-2 border border-slate-200 bg-white" : ""}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </Card>

      <BussinessInformation />
    </aside>
  );
};

export default AdminSidebar;
