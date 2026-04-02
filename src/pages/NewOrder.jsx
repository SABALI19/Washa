import Button from "../components/Button.jsx";
import CameraReviewSection from "../components/common/CameraReviewSection.jsx";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DRAFT_STORAGE_KEY = "washa-new-order-draft";

const orderSteps = [
  { id: 1, label: "Photo Capture" },
  { id: 2, label: "Item Details" },
  { id: 3, label: "Pickup Time" },
  { id: 4, label: "Review & Confirm" },
];

const serviceOptions = [
  "Wash & Fold",
  "Dry Cleaning",
  "Ironing",
  "Stain Treatment",
];

const pickupWindows = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const createDefaultPickupDetails = () => ({
  pickupDate: "",
  pickupWindow: "",
  instructions: "",
});

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

const normalizeCapturedItems = (items) =>
  items.map((item, index) => ({
    ...item,
    name: item.name?.trim() || `Item ${index + 1}`,
    service: item.service || "Wash & Fold",
    notes: item.notes || "",
  }));

const stepContent = {
  1: {
    title: "Photograph each clothing item",
    description:
      "Take clear photos of each item you want to include in your laundry order.",
  },
  2: {
    title: "Add item details",
    description:
      "Review each captured item, confirm the item name, and choose the service needed.",
  },
  3: {
    title: "Choose your pickup time",
    description:
      "Select the preferred pickup window and share any delivery or handling instructions.",
  },
  4: {
    title: "Review and confirm",
    description:
      "Double-check your items and pickup information before submitting the order.",
  },
};

const NewOrder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedItems, setCapturedItems] = useState([]);
  const [pickupDetails, setPickupDetails] = useState(createDefaultPickupDetails);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!rawDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft);
      const draftItems = Array.isArray(parsedDraft.capturedItems)
        ? normalizeCapturedItems(parsedDraft.capturedItems)
        : [];

      setCapturedItems(draftItems);
      setPickupDetails({
        ...createDefaultPickupDetails(),
        ...(parsedDraft.pickupDetails || {}),
      });
      setCurrentStep(parsedDraft.currentStep || 1);
      setNotice({
        type: "info",
        text: parsedDraft.savedAt
          ? `Draft restored from ${new Date(parsedDraft.savedAt).toLocaleString()}.`
          : "Draft restored.",
      });
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  const hasDraftContent = useMemo(
    () =>
      capturedItems.length > 0 ||
      Boolean(pickupDetails.pickupDate) ||
      Boolean(pickupDetails.pickupWindow) ||
      Boolean(pickupDetails.instructions.trim()),
    [capturedItems, pickupDetails]
  );

  const updateCapturedItem = (itemId, key, value) => {
    setCapturedItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, [key]: value } : item
      )
    );
  };

  const saveDraft = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasDraftContent) {
      setNotice({
        type: "warning",
        text: "Add at least one item or pickup detail before saving a draft.",
      });
      return;
    }

    const draftPayload = {
      currentStep,
      capturedItems,
      pickupDetails,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
    setNotice({
      type: "success",
      text: "Draft saved successfully. You can come back and continue later.",
    });
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!capturedItems.length) {
        setNotice({
          type: "warning",
          text: "Capture or upload at least one item before continuing.",
        });
        return;
      }

      setCapturedItems((currentItems) => normalizeCapturedItems(currentItems));
      setCurrentStep(2);
      setNotice(null);
      return;
    }

    if (currentStep === 2) {
      const hasInvalidItems = capturedItems.some(
        (item) => !item.name?.trim() || !item.service
      );

      if (hasInvalidItems) {
        setNotice({
          type: "warning",
          text: "Complete the item name and service for every captured item.",
        });
        return;
      }

      setCurrentStep(3);
      setNotice(null);
      return;
    }

    if (currentStep === 3) {
      if (!pickupDetails.pickupDate || !pickupDetails.pickupWindow) {
        setNotice({
          type: "warning",
          text: "Choose both a pickup date and pickup window before reviewing.",
        });
        return;
      }

      setCurrentStep(4);
      setNotice(null);
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.localStorage.setItem(
        "washa-last-order-submission",
        JSON.stringify({
          submittedAt: new Date().toISOString(),
          capturedItems,
          pickupDetails,
        })
      );
    }

    navigate("/orders");
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(1, step - 1));
    setNotice(null);
  };

  const currentStepContent = stepContent[currentStep];
  const continueLabel =
    currentStep === 1
      ? "Continue to Details"
      : currentStep === 2
        ? "Continue to Pickup"
        : currentStep === 3
          ? "Review Order"
          : "Submit Order";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-800">
            New Laundry Order
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create a new order by photographing your items and selecting pickup
            preferences.
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
        {orderSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive || isCompleted
                      ? "bg-[#2c4a7d] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>
                <p
                  className={`whitespace-nowrap text-sm font-medium ${
                    isActive || isCompleted
                      ? "text-[#2c4a7d]"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index !== orderSteps.length - 1 && (
                <div className="mx-4 hidden h-px w-16 bg-slate-200 sm:block" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md ring-1 ring-slate-100">
        <div className="mb-6 text-center">
          <h2 className="text-sm font-semibold text-slate-800">
            {currentStepContent.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {currentStepContent.description}
          </p>
        </div>

        {notice && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              notice.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : notice.type === "warning"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-[#dce8f6] text-[#2c4a7d]"
            }`}
          >
            {notice.text}
          </div>
        )}

        {currentStep === 1 && (
          <CameraReviewSection
            capturedItems={capturedItems}
            onCapturedItemsChange={setCapturedItems}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {capturedItems.map((item, index) => (
              <article
                key={item.id}
                className="grid gap-5 rounded-2xl border border-slate-200 p-4 lg:grid-cols-[160px_minmax(0,1fr)]"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Item name
                    </span>
                    <input
                      type="text"
                      value={item.name || `Item ${index + 1}`}
                      onChange={(event) =>
                        updateCapturedItem(item.id, "name", event.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                      placeholder={`Item ${index + 1}`}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Service
                    </span>
                    <select
                      value={item.service || "Wash & Fold"}
                      onChange={(event) =>
                        updateCapturedItem(
                          item.id,
                          "service",
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                    >
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Notes
                    </span>
                    <textarea
                      value={item.notes || ""}
                      onChange={(event) =>
                        updateCapturedItem(item.id, "notes", event.target.value)
                      }
                      rows={3}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                      placeholder="Add care instructions, stains, or anything the team should know."
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
            <div className="space-y-5 rounded-2xl border border-slate-200 p-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Pickup date
                </span>
                <input
                  type="date"
                  min={getTodayDateValue()}
                  value={pickupDetails.pickupDate}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      pickupDate: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                />
              </label>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Pickup window
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {pickupWindows.map((window) => (
                    <button
                      key={window}
                      type="button"
                      onClick={() =>
                        setPickupDetails((current) => ({
                          ...current,
                          pickupWindow: window,
                        }))
                      }
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        pickupDetails.pickupWindow === window
                          ? "border-[#2c4a7d] bg-[#dce8f6] text-[#2c4a7d]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#2c4a7d]/40"
                      }`}
                    >
                      {window}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Pickup instructions
                </span>
                <textarea
                  value={pickupDetails.instructions}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      instructions: event.target.value,
                    }))
                  }
                  rows={4}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                  placeholder="Gate code, alternate contact, or handling instructions."
                />
              </label>
            </div>

            <aside className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Pickup summary
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {capturedItems.length} items prepared for pickup.
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-700">Selected date</p>
                  <p>{pickupDetails.pickupDate || "Not selected yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Selected window</p>
                  <p>{pickupDetails.pickupWindow || "Not selected yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Instructions</p>
                  <p>
                    {pickupDetails.instructions.trim() ||
                      "No special instructions yet."}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {currentStep === 4 && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Item summary
                </h3>
                <div className="mt-4 space-y-4">
                  {capturedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl bg-slate-50 p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.service}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.notes || "No item notes added."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Pickup details
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-700">Pickup date</p>
                  <p>{pickupDetails.pickupDate}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Pickup window</p>
                  <p>{pickupDetails.pickupWindow}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Instructions</p>
                  <p>
                    {pickupDetails.instructions.trim() ||
                      "No pickup instructions added."}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Items in order</p>
                  <p>{capturedItems.length}</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                size="md"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm sm:w-auto"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="regular"
              size="md"
              className="inline-flex w-full items-center justify-center px-3 py-2 text-sm text-[#2c4a7d] sm:w-auto"
              onClick={saveDraft}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm sm:w-auto"
              onClick={handleContinue}
              disabled={currentStep === 1 && capturedItems.length === 0}
            >
              <span>{continueLabel}</span>
              {currentStep < 4 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewOrder;
