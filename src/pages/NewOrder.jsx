import Button from "../components/Button.jsx";
import CameraReviewSection from "../components/common/CameraReviewSection.jsx";
import jacketImage from "../assets/images/jacket.jpg";
import laundry1Image from "../assets/images/laundry1.jpg";
import laundry2Image from "../assets/images/laundry2.jpg";
import laundry4Image from "../assets/images/laundry4.jpg";
import laundry7Image from "../assets/images/laundry7.jpg";
import yellowTImage from "../assets/images/Yellow-T.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const orderSteps = [
  { id: 1, label: "Photo Capture", active: true },
  { id: 2, label: "Item Details" },
  { id: 3, label: "Pickup Time" },
  { id: 4, label: "Review & Confirm" },
];

const capturedItems = [
  { id: 1, name: "Item 1", image: laundry1Image },
  { id: 2, name: "Item 2", image: laundry2Image },
  { id: 3, name: "Item 3", image: yellowTImage },
  { id: 4, name: "Item 4", image: laundry4Image },
  { id: 5, name: "Item 5", image: jacketImage },
  { id: 6, name: "Item 6", image: laundry7Image },
];

const NewOrder = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py- sm:px-6 lg:px-8">
    <div className="flex items-start justify-between">
  <div>
    <h1 className="text-base font-bold text-slate-800">
      New Laundry Order
    </h1>
    <p className="mt-1 text-xs text-slate-500">
      Create a new order by photographing your items and selecting pickup preferences.
    </p>
  </div>

  <Link
    to="/dashboard/customer"
    className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#2c4a7d] transition-colors hover:text-[#415a81]"
  >
    <ArrowLeft className="h-3.5 w-3.5" />
    <span>Back to Dashboard</span>
  </Link>
</div>

<div className="mt-5 flex flex-wrap items-center justify-center gap-y-3">
  {orderSteps.map((step, index) => (
    <div key={step.id} className="flex items-center">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            step.active
              ? "bg-[#2c4a7d] text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {step.id}
        </div>
        <p
          className={`whitespace-nowrap text-sm font-medium ${
            step.active ? "text-[#2c4a7d]" : "text-slate-400"
          }`}
        >
          {step.label}
        </p>
      </div>
      {index !== orderSteps.length - 1 && (
        <div className="mx-4 hidden h-px w-16 bg-slate-200 sm:block" />
      )}
    </div>
  ))}
</div>

     <div className="mt-6 rounded-lg bg-white p-6 shadow-md ring-1 ring-slate-100">
  <div className="mb-6 text-center">
    <h2 className="text-sm font-semibold text-slate-800">
      Photograph each clothing item
    </h2>
    <p className="mt-1 text-xs text-slate-500">
      Take clear photos of each item you want to include in your laundry order.
    </p>
  </div>

  <CameraReviewSection
    capturedItems={capturedItems}
    onCapturePhoto={() => {}}
    onActivateCamera={() => {}}
  />

  <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
    <Button
      variant="regular"
      size="md"
      className="px-3 py-2 text-sm text-[#2c4a7d]"
    >
      Save as Draft
    </Button>
    <Button
      variant="primary"
      size="md"
      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm"
    >
      <span>Continue to Details</span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
</div>
    </section>
  );
};

export default NewOrder;
