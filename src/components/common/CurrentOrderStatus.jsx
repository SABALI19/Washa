import Card from "../Card";

const legendItems = [
  { label: "Pending Verification", value: "29%", color: "#157f85" },
  { label: "Washing", value: "23%", color: "#1f9fa6" },
  { label: "Ready for Pickup", value: "14%", color: "#8dad8f" },
  { label: "Drying", value: "18%", color: "#6e8aa1" },
  { label: "Ironing", value: "16%", color: "#7ea0b0" },
];

const CurrentOrderStatus = () => {
  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1.15rem] font-semibold text-slate-900">
        Current Order Status
      </h2>

      <div className="mt-5 flex justify-center">
        <div
          className="relative h-36 w-36 rounded-full"
          style={{
            background:
              "conic-gradient(#157f85 0% 29%, #1f9fa6 29% 52%, #8dad8f 52% 66%, #6e8aa1 66% 84%, #7ea0b0 84% 100%)",
          }}
        >
          <div className="absolute inset-5 rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {legendItems.slice(0, 3).map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[0.82rem] text-slate-600">{item.label}</span>
            </div>
            <span className="text-[0.82rem] font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CurrentOrderStatus;
