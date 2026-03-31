import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FabButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
   <button
  type="button"
  onClick={() => navigate("/new-order")}
  className={`fixed right-4 top-30 z-50 flex h-14 w-14 items-center justify-center rounded-full border-b-4 border-b-[#2c4a7d] bg-[] p-0 text-[#2c4a7d] shadow-2xl shadow-[#2c4a7d] transition-all active:scale-95 sm:hidden ${className}`}
  aria-label="New laundry order"
>
  <Plus className="h-6 w-6" />
</button>
  );
};

export default FabButton;
