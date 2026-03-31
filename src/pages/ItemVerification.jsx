import Button from "../components/Button";
import jacketImage from "../assets/images/jacket.jpg";
import laundry1Image from "../assets/images/laundry1.jpg";
import laundry2Image from "../assets/images/laundry2.jpg";
// import laundry4Image from "../assets/images/laundry4.jpg";
import laundry7Image from "../assets/images/laundry7.jpg";
import yellowTImage from "../assets/images/Yellow-T.jpg";
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Flag,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const checklistItems = [
  "Item matches photo",
  "Category correct",
  "Color accurate",
  "Condition as described",
];

const itemThumbnails = [
  { id: 1, image: laundry1Image, active: true },
  { id: 2, image: laundry2Image, active: false },
  { id: 3, image: yellowTImage, active: false },
  { id: 4, image: jacketImage, active: false },
  { id: 5, image: laundry7Image, active: false },
];

const summaryStats = [
  {
    id: "verified",
    label: "Verified items",
    value: 3,
    Icon: CheckCircle2,
  },
  {
    id: "flagged",
    label: "Flagged items",
    value: 1,
    Icon: Flag,
  },
  {
    id: "missing",
    label: "Missing items",
    value: 0,
    Icon: CircleX,
  },
];

const ItemVerification = () => {
  const { orderId = "LT-2024-0315" } = useParams();
  const [flagIssue, setFlagIssue] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[1500px]">
      <div className="rounded-[2rem] bg-white px-6 py-7 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[2.5rem] font-semibold tracking-[-0.04em] text-slate-900">
              Order Verification - #{orderId}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[1.1rem] text-slate-500">
              <p>Submitted: Today at 1:45 PM</p>
              <p>Customer: Emily Chen • (555) 123-4567</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <span className="rounded-full bg-[var(--color-primary-soft)] px-6 py-3 text-[1.1rem] font-medium text-[var(--color-primary)]">
              8 Items Total
            </span>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-6 py-3 text-[1.1rem] font-medium text-[var(--color-primary)]">
              3 of 12 Verified
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-slate-900">
              Customer Photos
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-50">
              <img
                src={laundry1Image}
                alt="Customer item"
                className="h-[520px] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#dce8f6] px-4 py-2 text-[1rem] font-medium text-[var(--color-primary)]">
                Dress Shirt
              </span>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-[1rem] font-medium text-[var(--color-primary)]">
                White
              </span>
            </div>

            <div className="mt-6 rounded-[1.25rem] bg-slate-50 px-5 py-5">
              <p className="text-[1.1rem] font-semibold text-slate-900">
                Customer Notes:
              </p>
              <p className="mt-3 text-[1.1rem] leading-8 text-slate-600">
                "Light stain on the collar, otherwise in good condition. Please
                handle with care."
              </p>
            </div>

            <div className="mt-20 flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="md"
                className="inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-base"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </Button>

              <p className="text-[1.2rem] font-medium text-slate-900">
                Item 4 of 12
              </p>

              <Button
                variant="secondary"
                size="md"
                className="inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-base"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {itemThumbnails.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    item.active
                      ? "border-[var(--color-primary)]"
                      : "border-slate-200"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={`Thumbnail ${item.id}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <div className="border-b border-slate-100 px-6 py-6">
              <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-slate-900">
                Physical Item Check
              </h2>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h3 className="text-[1.45rem] font-semibold text-slate-900">
                  Verification Checklist
                </h3>
                <div className="mt-5 space-y-4">
                  {checklistItems.map((item) => (
                    <label key={item} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-[1.1rem] text-slate-800">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[1.45rem] font-semibold text-slate-900">
                    Flag Issue
                  </h3>
                  <button
                    type="button"
                    aria-pressed={flagIssue}
                    onClick={() => setFlagIssue((value) => !value)}
                    className={`relative h-8 w-14 rounded-full transition-colors ${
                      flagIssue
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-primary-soft)]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                        flagIssue ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-[1.05rem] text-slate-500"
                  >
                    <span>Select issue type</span>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </button>

                  <Button
                    variant="secondary"
                    size="md"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Capture Documentation Photo</span>
                  </Button>

                  <textarea
                    placeholder="Describe the issue in detail..."
                    className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-5 py-4 text-[1.05rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
                  />

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-[1.05rem] text-slate-500"
                  >
                    <span>Severity level</span>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="md"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base"
                >
                  <Check className="h-5 w-5" />
                  <span>Confirm Item</span>
                </Button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-warm-soft)] px-6 py-4 text-base font-semibold text-[var(--color-primary)]"
                >
                  <Flag className="h-5 w-5" />
                  <span>Flag for Review</span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f7dada] px-6 py-4 text-base font-semibold text-[var(--color-primary)]"
                >
                  <X className="h-5 w-5" />
                  <span>Item Not Found</span>
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-900">
              Verification Summary
            </h2>

            <div className="mt-6 space-y-5">
              {summaryStats.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <item.Icon className="h-5 w-5 text-[var(--color-primary)]" />
                    <span className="text-[1.1rem] text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-[1.2rem] font-semibold text-[var(--color-primary)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              className="mt-7 flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base opacity-55"
            >
              Complete Verification
            </Button>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-900">
              Order Notes
            </h2>

            <textarea
              placeholder="Add overall order notes..."
              className="mt-6 min-h-[120px] w-full rounded-2xl border border-slate-200 px-5 py-4 text-[1.05rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
            />

            <label className="mt-6 flex items-center gap-4">
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-[1.1rem] text-slate-800">Notify Customer</span>
            </label>

            <div className="mt-6 rounded-[1.25rem] bg-slate-50 px-5 py-5">
              <p className="text-[1.1rem] font-semibold text-slate-900">
                Special Handling:
              </p>
              <p className="mt-3 text-[1.1rem] leading-8 text-slate-600">
                Rush order - Priority processing requested. Customer prefers
                eco-friendly cleaning solutions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ItemVerification;
