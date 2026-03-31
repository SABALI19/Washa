import Card from "../../components/Card.jsx";

const ratings = [120, 205, 160, 92, 86, 128, 146];
const ratingLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const feedbackWords = [
  { text: "Customer", size: "text-[1.95rem]" },
  { text: "Feedback", size: "text-[1.95rem]" },
  { text: "Service", size: "text-[1rem]" },
  { text: "friendly", size: "text-[0.68rem]" },
  { text: "helpful", size: "text-[0.72rem]" },
  { text: "delivery", size: "text-[0.65rem]" },
  { text: "staff", size: "text-[0.72rem]" },
  { text: "timely", size: "text-[0.68rem]" },
  { text: "quality", size: "text-[0.68rem]" },
  { text: "clean", size: "text-[0.62rem]" },
  { text: "service", size: "text-[0.82rem]" },
  { text: "trustworthy", size: "text-[0.62rem]" },
  { text: "satisfied", size: "text-[0.62rem]" },
  { text: "fast", size: "text-[0.62rem]" },
  { text: "professional", size: "text-[0.62rem]" },
  { text: "pickup", size: "text-[0.6rem]" },
  { text: "careful", size: "text-[0.6rem]" },
  { text: "cleaners", size: "text-[0.6rem]" },
];

const chartWidth = 220;
const chartHeight = 110;
const maxValue = 220;
const paddingLeft = 18;
const paddingBottom = 18;
const barWidth = 18;
const barGap = 9;

const CustomerExperience = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Customer Experience</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <MetricBlock label="Overall Rating" value="4.8" tone="primary" />
        <MetricBlock label="Net Promoter Score" value="72" tone="primary" />
        <MetricBlock label="Dispute Rate" value="0.8%" tone="danger" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <p className="text-[0.78rem] font-medium text-slate-700">Rating Distribution</p>
          <div className="mt-2 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[104px] w-full min-w-[220px]"
              role="img"
              aria-label="Rating distribution chart"
            >
              {[0, 50, 100, 150, 200].map((tick) => {
                const y = 8 + ((maxValue - tick) / maxValue) * (chartHeight - 26);

                return (
                  <g key={tick}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - 8}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 6}
                      y={y + 3}
                      fontSize="8"
                      textAnchor="end"
                      fill="#94a3b8"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {ratings.map((value, index) => {
                const x = paddingLeft + index * (barWidth + barGap);
                const barHeight = (value / maxValue) * (chartHeight - 26);
                const y = chartHeight - paddingBottom - barHeight;

                return (
                  <g key={ratingLabels[index]}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="2"
                      fill="#5b74c7"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 5}
                      fontSize="8"
                      textAnchor="middle"
                      fill="#94a3b8"
                    >
                      {index % 2 === 0 ? ratingLabels[index] : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div>
          <p className="text-[0.78rem] font-medium text-slate-700">Common Feedback</p>
          <div className="mt-2 flex min-h-[96px] flex-wrap items-center justify-center gap-x-2 gap-y-1 overflow-hidden rounded-md bg-[#20252d] px-4 py-4 text-white">
            {feedbackWords.map((word) => (
              <span key={word.text} className={`${word.size} font-semibold leading-none`}>
                {word.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const MetricBlock = ({ label, value, tone }) => {
  const toneClassName =
    tone === "danger" ? "text-[#dc2626]" : "text-[var(--color-primary)]";

  return (
    <div className="text-center">
      <p className={`text-[1.8rem] font-semibold leading-none ${toneClassName}`}>{value}</p>
      <p className="mt-1 text-[0.68rem] text-slate-500">{label}</p>
    </div>
  );
};

export default CustomerExperience;
