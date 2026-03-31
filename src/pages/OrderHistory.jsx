import Button from "../components/Button";
import FabButton from "../components/common/FabButton.jsx";
import jacketImage from "../assets/images/jacket.jpg";
import laundry1Image from "../assets/images/laundry1.jpg";
import laundry2Image from "../assets/images/laundry2.jpg";
import laundry4Image from "../assets/images/laundry4.jpg";
import laundry7Image from "../assets/images/laundry7.jpg";
import yellowTImage from "../assets/images/Yellow-T.jpg";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cuboid,
  Plus,
  RefreshCw,
  Search,
  Shirt,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const filters = [
  { id: "range", label: "Last 30 days" },
  { id: "status", label: "All Status" },
];

const sortOptions = [
  { id: "newest", label: "Newest First", active: true },
  { id: "oldest", label: "Oldest First", active: false },
];

const orders = [
  {
    id: "LT2024245",
    completedText: "Completed on March 12, 2024",
    status: "Completed",
    statusClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
    eventLabel: "Picked up",
    eventDate: "March 12, 2024",
    itemsCount: 8,
    previewImages: [laundry1Image, laundry7Image, laundry4Image, jacketImage],
  },
  {
    id: "LT2024244",
    completedText: "Completed on March 8, 2024",
    status: "Completed",
    statusClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
    eventLabel: "Picked up",
    eventDate: "March 8, 2024",
    itemsCount: 12,
    previewImages: [laundry1Image, laundry2Image, yellowTImage, jacketImage],
  },
  {
    id: "LT2024243",
    completedText: "Cancelled on March 5, 2024",
    status: "Cancelled",
    statusClassName: "bg-[#f7dada] text-[#b7545b]",
    eventLabel: "Cancelled",
    eventDate: "March 5, 2024",
    itemsCount: 5,
    previewImages: [laundry1Image, laundry7Image, laundry4Image],
  },
  {
    id: "LT2024242",
    completedText: "Completed on March 1, 2024",
    status: "Completed",
    statusClassName: "bg-[#d7ecf1] text-[#2c4a7d]",
    eventLabel: "Picked up",
    eventDate: "March 1, 2024",
    itemsCount: 9,
    previewImages: [yellowTImage, laundry1Image, laundry2Image, jacketImage],
  },
];

const summaryCards = [
  {
    id: "completed",
    icon: Check,
    title: "47",
    subtitle: "Orders Completed",
  },
  {
    id: "items",
    icon: Cuboid,
    title: "432",
    subtitle: "Items Cleaned",
  },
  {
    id: "frequent",
    icon: Shirt,
    title: "Dress Shirts",
    subtitle: "Most Frequent Item",
  },
];

const OrderHistory = () => {
  return (
    <section className="mx-auto w-full ">
     <FabButton />
     <div className="flex items-start justify-between">
  <div>
    <h1 className="text-base font-bold text-slate-800">Order History</h1>
    <p className="mt-1 text-xs text-slate-500">
      Complete archive of your past laundry orders (247 total orders)
    </p>
  </div>
  <Link to="/new-order" className="hidden self-start sm:block">
    <Button
      variant="primary"
      size="md"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2c4a7d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#415a81]"
    >
      <Plus className="h-4 w-4" />
      <span className="font-inter">New Order</span>
    </Button>
  </Link>
</div>

<div className="mt-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
  <div className="flex flex-col gap-3 xl:flex-row">
    <label className="flex h-9 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-400">
      <Search className="h-4 w-4 shrink-0" />
      <input
        type="text"
        placeholder="Search by order ID or date..."
        className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </label>
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="inline-flex h-9 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 sm:min-w-[120px]"
        >
          <span>{filter.label}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      ))}
    </div>
  </div>

  <div className="mt-3 flex items-center justify-between">
    <div className="flex gap-2">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            option.active
              ? "bg-[#415a81] text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#415a81]"
    >
      <X className="h-3.5 w-3.5" />
      <span>Clear Filters</span>
    </button>
  </div>
</div>

{/* orders listing */}
      <div className="mt-4 space-y-4">
  {orders.map((order) => (
    <article
      key={order.id}
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left: Order meta */}
      <div className="min-w-0 flex-1 ">
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Order #{order.id}
          </h2>
          <span
            className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${order.statusClassName}`}
          >
            {order.status}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{order.completedText}</p>

        {/* Images + item count */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {order.previewImages.map((image, index) => (
            <div
              key={`${order.id}-${index}`}
              className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100"
            >
              <img
                src={image}
                alt={`Order ${order.id} item ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <span className="text-xs text-slate-500">{order.itemsCount} items</span>
        </div>
      </div>

      {/* Right: Event date + actions */}
      <div className="flex items-center gap-6 sm:shrink-0">
        <div className="text-right">
          <p className="text-xs text-slate-500">{order.eventLabel}</p>
          <p className="text-xs font-semibold text-slate-900">{order.eventDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/order-tracking/${order.id}`}
            className="text-xs font-medium text-[#2c4a7d]"
          >
            View Details
          </Link>
          <Link to="/new-order">
            <Button
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#415a81] px-3 py-1.5 text-xs font-medium text-[#415a81] hover:bg-[#2c4a7d] hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reorder</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  ))}
</div>

{/* Pagination */}
<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs text-slate-500">Showing 1-10 of 247 orders</p>

  <div className="flex items-center gap-2 text-xs text-slate-500">
    <button type="button" className="rounded-full p-1.5 hover:bg-slate-100">
      <ChevronLeft className="h-4 w-4" />
    </button>
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#415a81]  hover:bg-[#2c4a7d] font-semibold text-white"
    >
      1
    </button>
    <button type="button" className="font-medium text-slate-700">2</button>
    <button type="button" className="font-medium text-slate-700">3</button>
    <span>...</span>
    <button type="button" className="font-medium text-slate-700">25</button>
    <button type="button" className="rounded-full p-1.5 hover:bg-slate-100">
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
</div>

      <div className="mt-16">
        <h2 className="text-sm font-semibold text-slate-900">
          This Year's Summary
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.id}
              className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ecf1] text-[#118a8a]">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
