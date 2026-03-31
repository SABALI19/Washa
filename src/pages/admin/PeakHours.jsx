import Card from "../../components/Card.jsx";

const peakHours = [
  { label: "6-9 AM",  value: 124 },
  { label: "9-12 PM", value: 189 },
  { label: "12-3 PM", value: 156 },
  { label: "3-6 PM",  value: 142 },
  { label: "6-9 PM",  value: 98  },
];

const peakMax = 210;

const PeakHours = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900 mb-4">
        Peak Hours
      </h2>

      <div className="space-y-3">
        {peakHours.map((row) => {
          const pct = (row.value / peakMax) * 100;
          return (
            <div key={row.label} className="flex items-center gap-3">
              {/* Label */}
              <span className="w-14 flex-shrink-0 text-xs text-gray-600">
                {row.label}
              </span>

              {/* Bar */}
              <div className="flex-1 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: "var(--color-primary)" }}
                />
              </div>

              {/* Value */}
              <span className="w-8 text-right text-xs font-semibold text-gray-700">
                {row.value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PeakHours;
