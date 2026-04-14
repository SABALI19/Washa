import Card from "../Card";
import { Building2, CirclePower, UsersRound } from "lucide-react";

const BussinessInformation = ({ businessInformation = {} }) => {
  const businessName = businessInformation.name || "Clean & Fresh Laundry";
  const statusLabel =
    businessInformation.statusLabel || businessInformation.status || "Operating";
  const staffOnDutyCount =
    businessInformation.staffOnDutyCount ?? businessInformation.staffCount;
  const staffOnDutyLabel =
    businessInformation.staffOnDutyLabel ||
    (Number.isFinite(Number(staffOnDutyCount))
      ? `${Number(staffOnDutyCount).toLocaleString()} staff on duty`
      : "Staff status unavailable");

  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="whitespace-nowrap text-[1.25rem] font-inter font-semibold text-[#2c4a7d]">
        Business Information
      </h2>

      <div className="mt-4 space-y-3.5">
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-[0.9rem] font-semibold text-slate-900">
            {businessName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CirclePower className="h-4 w-4 text-[#22c55e]" />
          <span className="text-[0.82rem] text-slate-600">{statusLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <UsersRound className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-[0.82rem] text-slate-600">{staffOnDutyLabel}</span>
        </div>
      </div>
    </Card>
  );
};

export default BussinessInformation;
