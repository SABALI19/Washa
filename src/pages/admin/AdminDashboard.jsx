import Button from "../../components/Button";
import AlertsNotification from "../../components/common/Alerts&Notification.jsx";
import CurrentOrderStatus from "../../components/common/CurrentOrderStatus.jsx";
import OrdervolumeTrend from "../../components/common/OrdervolumeTrend.jsx";
import RecentActivity from "../../components/common/RecentActivity.jsx";
import StatsCards from "../../components/common/StatsCards.jsx";
import Card from "../../components/Card.jsx";
import AdminSidebar from "../../layouts/AdminSidebar.jsx";
import {
  Clock3,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  Settings,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Orders Today",
    value: "142",
    change: "+12%",
    Icon: Package,
  },
  {
    title: "Active Orders",
    value: "87",
    change: "+8%",
    Icon: Clock3,
  },
  {
    title: "Revenue Today",
    value: "$2,840",
    change: "+15%",
    Icon: DollarSign,
  },
  {
    title: "Customer Satisfaction",
    value: "4.8",
    subtitle: "32 reviews",
    Icon: Star,
  },
];

const adminQuickActions = [
  "View All Orders",
  "Dispute Management",
  "Performance Reports",
  "Staff Schedule",
];

const AdminDashboard = () => {
  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
          <AdminSidebar />

          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="mt-1.5 text-[0.72rem] text-slate-500">
                  December 15, 2024 • 2:30 PM
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Data</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCards key={stat.title} {...stat} />
              ))}
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
              <OrdervolumeTrend />
              <CurrentOrderStatus />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
              <RecentActivity />

              <div className="space-y-4">
                <AlertsNotification />

                <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
                  <h2 className="text-[1rem] font-semibold text-slate-900">
                    Quick Actions
                  </h2>

                  <div className="mt-4 space-y-2.5">
                    {adminQuickActions.map((action, index) => (
                      <button
                        key={action}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-left text-[0.8rem] font-medium text-slate-800 transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[0.72rem] text-[var(--color-primary)]">
                          {index + 1}
                        </span>
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
