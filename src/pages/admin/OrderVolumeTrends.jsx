import Card from "../../components/Card.jsx";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const totalOrders  = [145, 162, 138, 175, 190, 205, 160];
const newCustomers = [32,  40,  28,  45,  50,  48,  35];
const returning    = [105, 118, 108, 128, 138, 155, 122];

const W = 560, H = 180;
const padL = 36, padR = 16, padT = 12, padB = 28;
const innerW = W - padL - padR;
const innerH = H - padT - padB;
const dataMax = 260;

const toX = (i) => padL + (i / (days.length - 1)) * innerW;
const toY = (v) => padT + ((dataMax - v) / dataMax) * innerH;

const smoothPath = (data) => {
  const pts = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
};

const areaPath = (data, lineD) => {
  const pts = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
  return `${lineD} L ${pts[pts.length - 1].x} ${H - padB} L ${pts[0].x} ${H - padB} Z`;
};

const yTicks = [0, 50, 100, 150, 200, 250];

const totalLine  = smoothPath(totalOrders);
const newLine    = smoothPath(newCustomers);
const returnLine = smoothPath(returning);

const Dot = ({ color }) => (
  <span
    className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
    style={{ backgroundColor: color }}
  />
);

const OrderVolumeTrends = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-[1rem] font-semibold text-slate-900">
          Order Volume Trends
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#0f766e" /> Total Orders
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#2dd4bf" /> New Customers
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#94a3b8" /> Returning
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[400px]"
          style={{ height: 180 }}
          role="img"
          aria-label="Order volume trends chart"
        >
          <defs>
            <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="grad-return" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-axis grid + labels */}
          {yTicks.map((tick) => {
            const y = toY(tick);
            return (
              <g key={tick}>
                <line x1={padL} y1={y} x2={W - padR} y2={y}
                  stroke="#e2e8f0" strokeWidth="0.8" />
                <text x={padL - 6} y={y + 4} fontSize="9" textAnchor="end" fill="#94a3b8">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area fills */}
          <path d={areaPath(totalOrders, totalLine)} fill="url(#grad-total)" />
          <path d={areaPath(returning, returnLine)}  fill="url(#grad-return)" />

          {/* Lines */}
          <path d={returnLine} fill="none" stroke="#94a3b8" strokeWidth="1.8"
            strokeLinejoin="round" strokeLinecap="round" />
          <path d={newLine}    fill="none" stroke="#2dd4bf" strokeWidth="1.8"
            strokeLinejoin="round" strokeLinecap="round" />
          <path d={totalLine}  fill="none" stroke="#0f766e" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />

          {/* Dots + X labels */}
          {days.map((day, i) => (
            <g key={day}>
              <circle cx={toX(i)} cy={toY(totalOrders[i])}  r="2.5" fill="white" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx={toX(i)} cy={toY(newCustomers[i])} r="2.5" fill="white" stroke="#2dd4bf" strokeWidth="1.5" />
              <circle cx={toX(i)} cy={toY(returning[i])}    r="2.5" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
              <text x={toX(i)} y={H - 6} fontSize="9.5" textAnchor="middle" fill="#94a3b8">
                {day}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};

export default OrderVolumeTrends;