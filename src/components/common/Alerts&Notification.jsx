import Card from "../Card";
import { AlertTriangle, Clock3, UserRoundCheck } from "lucide-react";

const alerts = [
  {
    id: "overdue",
    title: "Overdue Orders",
    text: "3 orders past pickup time",
    Icon: Clock3,
    className: "border border-[#fecaca] bg-[#fff1f2] text-[#dc2626]",
  },
  {
    id: "disputes",
    title: "Pending Disputes",
    text: "2 disputes need resolution",
    Icon: AlertTriangle,
    className: "border border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
  },
  {
    id: "approvals",
    title: "Staff Approvals",
    text: "5 items need approval",
    Icon: UserRoundCheck,
    className: "border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]",
  },
];

const AlertsNotification = () => {
  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">
        Alerts & Notifications
      </h2>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl px-3 py-3 ${alert.className}`}
          >
            <div className="flex items-start gap-3">
              <alert.Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-[0.82rem] font-semibold">{alert.title}</p>
                <p className="mt-1 text-[0.72rem]">{alert.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertsNotification;
