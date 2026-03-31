import Card from "../../components/Card.jsx";

const labels = ["Verification", "Washing", "Drying", "Ironing", "Total Time"];
const values = [12, 45, 38, 26, 142];
const maxValue = 150;

const chartWidth = 360;
const chartHeight = 175;
const paddingLeft = 34;
const paddingRight = 12;
const paddingTop = 16;
const paddingBottom = 24;
const barGap = 18;
const barWidth =
  (chartWidth - paddingLeft - paddingRight - barGap * (values.length - 1)) /
  values.length;

const ProcessingPerformance = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">
        Processing Performance
      </h2>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[170px] w-full min-w-[360px]"
          role="img"
          aria-label="Processing performance chart"
        >
          {[0, 30, 60, 90, 120, 150].map((tick) => {
            const y =
              paddingTop +
              ((maxValue - tick) / maxValue) *
                (chartHeight - paddingTop - paddingBottom);

            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fontSize="10"
                  textAnchor="end"
                  fill="#94a3b8"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {values.map((value, index) => {
            const x = paddingLeft + index * (barWidth + barGap);
            const barHeight =
              (value / maxValue) * (chartHeight - paddingTop - paddingBottom);
            const y = chartHeight - paddingBottom - barHeight;

            return (
              <g key={labels[index]}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  fill="var(--color-primary)"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 8}
                  fontSize="9"
                  textAnchor="middle"
                  fill="#94a3b8"
                >
                  {labels[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-medium text-slate-700">Bottlenecks</p>
          <p className="mt-1 text-[0.72rem] text-[#d97706]">
            Washing stage (+8min)
          </p>
        </div>
        <div>
          <p className="text-[0.72rem] font-medium text-slate-700">Efficiency</p>
          <p className="mt-1 text-[0.72rem] text-[#16a34a]">+12% improvement</p>
        </div>
      </div>
    </Card>
  );
};

export default ProcessingPerformance;
