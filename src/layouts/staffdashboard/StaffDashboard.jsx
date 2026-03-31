import Button from "../../components/Button";
import QuickActions from "./QuickActions.jsx";
import Quickfilter from "./Quickfilter.jsx";
import ShiftInformation from "./ShiftInformation.jsx";
import TodaySummary from "./TodaySummary.jsx";
import jacketImage from "../../assets/images/jacket.jpg";
import laundry1Image from "../../assets/images/laundry1.jpg";
import laundry2Image from "../../assets/images/laundry2.jpg";
import laundry4Image from "../../assets/images/laundry4.jpg";
import laundry7Image from "../../assets/images/laundry7.jpg";
import yellowTImage from "../../assets/images/Yellow-T.jpg";
import {
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const summaryItems = [
  { label: "Pending verification", value: 5 },
  { label: "In-process orders", value: 8 },
  { label: "Ready for pickup", value: 12 },
  { label: "Today's pickups", value: 7 },
];

const quickFilters = [
  "All Orders",
  "Needs Verification",
  "In Process",
  "Ready for Pickup",
  "Overdue",
];

const inProcessPreviewImage = laundry2Image;

const pendingVerificationOrders = [
  {
    id: "LT-2024-0315",
    customer: "Emily Chen",
    submittedAt: "Today at 1:45 PM",
    items: 8,
    rush: true,
    images: [laundry1Image, laundry7Image, yellowTImage],
  },
  {
    id: "LT-2024-0314",
    customer: "Michael Rodriguez",
    submittedAt: "Today at 11:20 AM",
    items: 5,
    rush: false,
    images: [jacketImage, laundry1Image, laundry4Image],
  },
  {
    id: "LT-2024-0313",
    customer: "Jessica Park",
    submittedAt: "Today at 9:15 AM",
    items: 12,
    rush: false,
    images: [yellowTImage, laundry2Image, laundry1Image],
  },
];

const inProcessOrders = [
  {
    id: "LT-2024-0312",
    stage: "Washing",
    progress: 34,
    time: "25 minutes",
    image: inProcessPreviewImage,
    badgeClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    id: "LT-2024-0311",
    stage: "Drying",
    progress: 67,
    time: "15 minutes",
    image: laundry7Image,
    badgeClassName: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
  },
  {
    id: "LT-2024-0310",
    stage: "Ironing",
    progress: 82,
    time: "8 minutes",
    image: laundry4Image,
    badgeClassName: "bg-[#dce8f6] text-[var(--color-primary)]",
  },
  {
    id: "LT-2024-0309",
    stage: "Washing",
    progress: 51,
    time: "18 minutes",
    image: laundry1Image,
    badgeClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
];

const pickupSections = [
  {
    label: "Morning (9:00 AM - 12:00 PM)",
    orders: [
      {
        id: "LT-2024-0308",
        customer: "David Kim",
        items: 6,
        time: "10:30 AM",
        status: "Ready",
        isActionActive: true,
        statusClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
      },
    ],
  },
  {
    label: "Afternoon (12:00 PM - 6:00 PM)",
    orders: [
      {
        id: "LT-2024-0307",
        customer: "Lisa Wang",
        items: 9,
        time: "2:15 PM",
        status: "Preparing",
        isActionActive: false,
        statusClassName: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
      },
      {
        id: "LT-2024-0306",
        customer: "Robert Taylor",
        items: 4,
        time: "4:00 PM",
        status: "Ready",
        isActionActive: true,
        statusClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
      },
    ],
  },
  {
    label: "Evening (6:00 PM - 8:00 PM)",
    orders: [
      {
        id: "LT-2024-0305",
        customer: "Amanda Brown",
        items: 7,
        time: "7:30 PM",
        status: "Preparing",
        isActionActive: false,
        statusClassName: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
      },
    ],
  },
];

const StaffDashboard = () => {
  return (
    <section className="mx-auto w-full max-w-[1450px]">
      <div className="grid gap-8 xl:grid-cols-[270px_minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <TodaySummary summaryItems={summaryItems} />
          <Quickfilter filters={quickFilters} />
          <ShiftInformation />
        </div>

        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[1.85rem] font-semibold tracking-[-0.03em] text-slate-900">
              Staff Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-[0.95rem] text-slate-500">March 15, 2024 - 2:30 PM</p>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--color-primary)]">
                Active Shift
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.2rem] font-semibold text-slate-900">
                Pending Verification (5 orders)
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.82rem] font-medium text-[var(--color-primary)]"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Priority Sort</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {pendingVerificationOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[1.15rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[0.98rem] font-semibold text-slate-900">
                          #{order.id}
                        </h3>
                        <span className="text-[0.98rem] text-slate-500">- {order.customer}</span>
                        {order.rush && (
                          <span className="rounded-full bg-[var(--color-warm-soft)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[var(--color-primary)]">
                            RUSH
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-[0.84rem] text-slate-500">
                        Submitted: {order.submittedAt}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.images.map((image, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="h-11 w-11 overflow-hidden rounded-lg bg-slate-100"
                          >
                            <img
                              src={image}
                              alt={`${order.id} item ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.78rem] font-semibold text-[var(--color-primary)]">
                        {order.items} items
                      </span>
                      <Link to={`/staff/verification/${order.id}`}>
                        <Button
                          variant="primary"
                          size="md"
                          className="rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold"
                        >
                          Start Verification
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
             
          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              In Process (8 orders)
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {inProcessOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[0.98rem] font-semibold text-slate-900">
                      #{order.id}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${order.badgeClassName}`}
                    >
                      {order.stage}
                    </span>
                  </div>

                  <div className="mt-4 h-2.5 rounded-full bg-[var(--color-primary-soft)]">
                    <div
                      className="h-2.5 rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>

                  <p className="mt-3 text-[0.78rem] text-slate-500">
                    In stage: {order.time}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                      <img
                        src={order.image}
                        alt={order.id}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="md"
                      className="rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                    >
                      Update Status
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              Scheduled Pickups
            </h2>

            <div className="mt-5 space-y-6">
              {pickupSections.map((section) => (
                <div key={section.label}>
                  <h3 className="text-[0.95rem] font-semibold text-slate-900">
                    {section.label}
                  </h3>

                  <div className="mt-3 space-y-3">
                    {section.orders.map((order) => (
                      <article
                        key={order.id}
                        className="flex flex-col gap-4 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-[0.98rem] font-semibold text-slate-900">
                              #{order.id}
                            </h4>
                            <span className="text-[0.84rem] text-slate-500">
                              - {order.customer}
                            </span>
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-500">
                            <span>{order.items} items</span>
                            <span>•</span>
                            <span>{order.time}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${order.statusClassName}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant={order.isActionActive ? "primary" : "secondary"}
                          size="md"
                          className={`self-start rounded-xl px-4 py-2 text-[0.78rem] font-semibold md:self-auto ${
                            order.isActionActive
                              ? ""
                              : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                          }`}
                        >
                          Mark Ready
                        </Button>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
