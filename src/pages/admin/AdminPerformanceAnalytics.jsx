import {
  Clock3,
  Download,
  DollarSign,
  Package,
  UsersRound,
} from "lucide-react";

import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";
import useAdminAnalytics from "../../hooks/useAdminAnalytics.js";
import OrderVolumeTrends from "./OrderVolumeTrends.jsx";
import PeakHours from "./PeakHours.jsx";
import CustomerExperience from "./CustomerExperience.jsx";
import FinancialPerformance from "./FinancialPerformance.jsx";
import PickupTimeUtilization from "./PickupTimeUtilization.jsx";
import ProcessingPerformance from "./ProcessingPerformance.jsx";
import StaffMetrics from "./StaffMetrics.jsx";

const rangeTabs = ["Day", "Week", "Month", "Quarter", "Year"];

const metricIconMap = {
  orders: Package,
  processing: Clock3,
  returning: UsersRound,
  revenue: DollarSign,
};

const MiniSparkline = () => {
  return (
    <div className="mt-1 overflow-hidden rounded-sm bg-slate-900/5">
      <svg viewBox="0 0 82 18" className="h-[18px] w-[82px]" role="img" aria-label="Orders trend">
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

const AdminPerformanceAnalytics = () => {
  const { analytics, error, isLoading } = useAdminAnalytics();
  const metrics = analytics?.metrics || [];

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
              Performance Analytics
            </h1>
            <p className="mt-1.5 text-[0.78rem] text-slate-500">
              {analytics?.dateRangeLabel || "Live operational range"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {rangeTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`rounded-xl px-4 py-2 text-[0.75rem] font-medium transition-colors ${
                  index === 1
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}

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

        {error && (
          <div className="mt-5 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-5 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            Loading admin analytics...
          </div>
        )}

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metricIconMap[metric.id] || Package;

            return (
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
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>{metric.id === "orders" ? <MiniSparkline /> : <p className="text-[0.72rem] text-slate-500">{metric.detail}</p>}</div>
                  <div className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-[#16a34a]">
                    <span>{metric.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OrderVolumeTrends
            labels={analytics?.orderVolumeTrends?.labels}
            newCustomers={analytics?.orderVolumeTrends?.newCustomers}
            returning={analytics?.orderVolumeTrends?.returning}
            totalOrders={analytics?.orderVolumeTrends?.totalOrders}
          />
          <PeakHours rows={analytics?.peakHours} />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <ProcessingPerformance
            bars={analytics?.processingPerformance?.bars}
            bottleneck={analytics?.processingPerformance?.bottleneck}
            efficiencyText={analytics?.processingPerformance?.efficiencyText}
          />
          <PickupTimeUtilization
            slots={analytics?.pickupTimeUtilization?.slots}
            summaryItems={analytics?.pickupTimeUtilization?.summaryItems}
          />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <CustomerExperience
            distribution={analytics?.customerExperience?.distribution}
            distributionLabel={analytics?.customerExperience?.distributionLabel}
            distributionLabels={analytics?.customerExperience?.distributionLabels}
            feedbackWords={analytics?.customerExperience?.feedbackWords}
            metricBlocks={analytics?.customerExperience?.metricBlocks}
            wordCloudLabel={analytics?.customerExperience?.wordCloudLabel}
          />
          <StaffMetrics
            primaryColumnLabel={analytics?.staffMetrics?.primaryColumnLabel}
            rows={analytics?.staffMetrics?.rows}
            secondaryColumnLabel={analytics?.staffMetrics?.secondaryColumnLabel}
            tertiaryColumnLabel={analytics?.staffMetrics?.tertiaryColumnLabel}
          />
        </div>

        <div className="mt-5">
          <FinancialPerformance
            dataPoints={analytics?.financialPerformance?.dataPoints}
            metrics={analytics?.financialPerformance?.metrics}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminPerformanceAnalytics;
