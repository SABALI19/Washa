import Button from "../components/Button";
import jacketImage from "../assets/images/jacket.jpg";
import laundry1Image from "../assets/images/laundry1.jpg";
import laundry2Image from "../assets/images/laundry2.jpg";
import laundry4Image from "../assets/images/laundry4.jpg";
import laundry7Image from "../assets/images/laundry7.jpg";
import yellowTImage from "../assets/images/Yellow-T.jpg";
import {
  CalendarClock,
  Check,
  Circle,
  Download,
  DownloadIcon,
  Flag,
  Grid2x2,
  Headphones,
  LoaderCircle,
  PackageCheck,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// ToggleSwitch component
const ToggleSwitch = ({
  enabled,
  onChange,
  label,
  description,
  id = "toggle-switch",
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label || "Toggle switch"}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          hover:opacity-80
          ${enabled ? "bg-[var(--color-primary)]" : "bg-gray-200"}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 
            transform rounded-full bg-white shadow-lg 
            ring-0 transition duration-200 ease-in-out
            absolute top-0.5
            ${enabled ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0.5"}
          `}
        />
      </button>
    </div>
  );
};

const orderSummary = {
  createdAt: "Created on March 15, 2024 at 9:30 AM",
  status: "Drying",
};

const progressSteps = [
  {
    label: "Order Received",
    status: "completed",
    detail: "Mar 15, 9:30 AM",
  },
  {
    label: "Washing",
    status: "completed",
    detail: "Mar 15, 11:00 AM",
  },
  {
    label: "Drying",
    status: "active",
    detail: "In Progress",
  },
  {
    label: "Ironing",
    status: "pending",
    detail: "Pending",
  },
  {
    label: "Ready for Pickup",
    status: "pending",
    detail: "Pending",
  },
];

const itemColorMap = {
  white: {
    dotClassName: "text-white stroke-slate-300",
    strokeWidth: 1.5,
  },
  blue: {
    dotClassName: "text-blue-500",
    strokeWidth: 0,
  },
  red: {
    dotClassName: "text-red-500",
    strokeWidth: 0,
  },
  black: {
    dotClassName: "text-black",
    strokeWidth: 0,
  },
  gray: {
    dotClassName: "text-slate-500",
    strokeWidth: 0,
  },
  navy: {
    dotClassName: "text-slate-800",
    strokeWidth: 0,
  },
  yellow: {
    dotClassName: "text-yellow-500",
    strokeWidth: 0,
  },
  bluecheckered: {
    dotClassName: "text-blue-400",
    strokeWidth: 0,
  },
};

const getItemColorStyle = (colorCategory) => {
  return itemColorMap[colorCategory] || itemColorMap.gray;
};

const trackedItems = [
  {
    id: 1,
    name: "Dress Shirt",
    image: laundry1Image,
    stage: "Drying",
    note: "",
    color: "black",
    stageClassName: "bg-amber-100 text-[#2c4a7d]",
  },
  {
    id: 2,
    name: "Jeans",
    image: laundry2Image,
    stage: "Drying",
    note: "",
    color: "white",
    stageClassName: "bg-amber-100 text-[#2c4a7d]",
  },
  {
    id: 3,
    name: "Polo Shirt",
    image: yellowTImage,
    stage: "Drying",
    note: "",
    color: "yellow",
    stageClassName: "bg-amber-100 text-[#2c4a7d]",
  },
  {
    id: 4,
    name: "Dress Pants",
    image: laundry4Image,
    stage: "Drying",
    note: "",
    color: "red",
    stageClassName: "bg-amber-100 text-[#2c4a7d]",
  },
  {
    id: 5,
    name: "T-Shirt",
    image: jacketImage,
    stage: "Washing",
    note: "",
    color: "blue",
    stageClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
  },
  {
    id: 6,
    name: "Denim Jacket",
    image: laundry7Image,
    stage: "Washing",
    note: "",
    color: "black",
    stageClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
  },
  {
    id: 7,
    name: "Sweater",
    image: jacketImage,
    stage: "Washing",
    note: "",
    color: "bluecheckered",
    stageClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
  },
  {
    id: 8,
    name: "Blazer",
    image: laundry7Image,
    stage: "Washing",
    note: "Dry clean only",
    color: "navy",
    stageClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
  },
];

const OrderTracking = () => {
  const { orderId = "LT2024001" } = useParams();
  const [pickupRemindersEnabled, setPickupRemindersEnabled] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: true,
    email: true,
  });

  const toggleNotificationPreference = (key) => {
    setNotificationPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <section className="mx-auto w-full max-w-[1180px] space-y-6">
      <div className="rounded-lg bg-white px-6 py-7 shadow-md sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-lg font-inter font-bold text-slate-900">
              Order #{orderId}
            </h1>
            <p className="mt-3 font-roboto text-sm text-gray-500 ">
              {orderSummary.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start">
            <span className="rounded-full bg-amber-100 px-4 py-1 text- font-semibold text-[#2c4a7d]">
              {orderSummary.status}
            </span>
            <button className="inline-flex items-center justify-center gap-1 text-base font-medium text-[#2c4a7d] transition-colors hover:text-[#415a81]">
              <DownloadIcon className="h-4 text-sm w-4" />
              <span className="font-mono text-sm text-md">Share Order</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-7 shadow-md ring-1 ring-slate-100 sm:px-8">
        <h2 className="mb-8 text-xl font-semibold text-slate-800">
          Order Progress
        </h2>

        {/* Steps row */}
        <div className="relative flex items-start justify-between">
          {progressSteps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";
            const isLast = index === progressSteps.length - 1;

            return (
              <div
                key={step.label}
                className="relative flex flex-1 flex-col items-center"
              >
                {/* Circle + connector line */}
                <div className="flex w-full items-center">
                  {/* Left connector (hidden for first item) */}
                  <div
                    className={`h-0.5 flex-1 ${index === 0 ? "invisible" : isCompleted ? "bg-teal-600" : "bg-slate-200"}`}
                  />

                  {/* Circle icon */}
                  <div
                    className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-teal-100 text-teal-600"
                        : isActive
                          ? "bg-amber-100 text-amber-500"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : isActive ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <PackageCheck className="h-4 w-4" />
                    )}
                  </div>

                  {/* Right connector (hidden for last item) */}
                  <div
                    className={`h-0.5 flex-1 ${isLast ? "invisible" : isCompleted ? "bg-[#2c4a7d]" : "bg-slate-200"}`}
                  />
                </div>

                {/* Label + detail */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    {step.label}
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${isPending ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Estimated Completion</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              March 17, 2024 - 3:00 PM
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Last Updated</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Mar 15, 1:45 PM
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-7 shadow-md ring-1 ring-slate-100 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-800">Pickup Details</h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Scheduled Pickup
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Date: March 17, 2024
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                Time: 3:00 PM - 6:00 PM
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">Location</h3>
              <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                <p>CleanCare Laundry Services</p>
                <p>123 Main Street, Suite 100</p>
                <p>Downtown, NY 10001</p>
                <p>(555) 123-4567</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Pickup Instructions
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Please bring a valid ID for pickup verification. Items will be
              ready at the front counter.
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white hover:bg-teal-800"
            >
              <CalendarClock className="h-4 w-4" />
              <span>Change Pickup Time</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-7 shadow-md ring-1 ring-slate-100 sm:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Your Items (12 items)
          </h2>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2c4a7d] transition-colors hover:text-teal-700">
            <Grid2x2 className="h-3.5 w-3.5" />
            <span>Gallery View</span>
          </button>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trackedItems.map((item) => {
            const colorStyle = getItemColorStyle(item.color);
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl bg-slate-50 p-4"
              >
                {/* Image */}
                <div className="aspect-[2/1] overflow-hidden rounded-lg bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Name + dot */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-800">
                    {item.name}
                  </h3>
                  <Circle
                    className={`h-3 w-3 shrink-0 ${colorStyle.dotClassName}`}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={colorStyle.strokeWidth}
                  />
                </div>
                {/* Badge */}
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${item.stageClassName}`}
                >
                  {item.stage}
                </span>
                {/* Note */}
                {item.note && (
                  <p className="mt-1.5 text-xs text-slate-400">{item.note}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-5 shadow-md ring-1 ring-slate-100 sm:px-8">
        <h2 className="text-sm font-semibold text-slate-800">Order Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="md"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download Receipt</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Flag className="h-4 w-4" />
            <span>Report Issue</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Headphones className="h-4 w-4" />
            <span>Contact Support</span>
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-5 shadow-md ring-1 ring-slate-100 sm:px-8">
        <ToggleSwitch
          id="pickup-reminders"
          label="Pickup Reminders"
          description="Get notified when your order is ready for pickup"
          enabled={pickupRemindersEnabled}
          onChange={setPickupRemindersEnabled}
        />

        <div className="mt-4 space-y-3">
          {[
            {
              key: "sms",
              label: "SMS Notifications",
              description: "Receive text messages for order updates",
            },
            {
              key: "email",
              label: "Email Notifications",
              description: "Receive email updates for order progress",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                type="checkbox"
                checked={notificationPreferences[item.key]}
                onChange={() => toggleNotificationPreference(item.key)}
                className="sr-only"
              />
              <div
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  notificationPreferences[item.key]
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-slate-400 bg-white"
                }`}
              >
                {notificationPreferences[item.key] && (
                  <Check
                    className="h-2.5 w-2.5 text-[var(--color-primary)]"
                    strokeWidth={3}
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;
