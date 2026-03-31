import Card from "../../components/Card.jsx";

const staffRows = [
  { name: "Mike Johnson", orders: 87, rating: "4.9" },
  { name: "Sarah Chen", orders: 76, rating: "4.8" },
  { name: "David Liu", orders: 92, rating: "4.7" },
  { name: "Emma Wilson", orders: 68, rating: "4.9" },
  { name: "Alex Rodriguez", orders: 54, rating: "4.6" },
];

const StaffMetrics = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-0 shadow-[0_6px_20px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="p-4">
        <h2 className="text-[1rem] font-semibold text-slate-900">Staff Metrics</h2>
      </div>

      <div className="border-t border-slate-100">
        <div className="grid grid-cols-[minmax(0,1fr)_64px_56px] bg-slate-50 px-4 py-2.5 text-[0.74rem] font-medium text-slate-600">
          <span>Staff</span>
          <span className="text-center">Orders</span>
          <span className="text-center">Rating</span>
        </div>

        {staffRows.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[minmax(0,1fr)_64px_56px] items-center border-t border-slate-100 px-4 py-3 text-[0.78rem]"
          >
            <span className="truncate text-slate-800">{row.name}</span>
            <span className="text-center text-slate-700">{row.orders}</span>
            <span className="text-center font-medium text-[var(--color-primary)]">
              {row.rating}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StaffMetrics;
