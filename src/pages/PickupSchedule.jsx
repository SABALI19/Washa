import Button from "../components/Button";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cog,
  PackageCheck,
  Phone,
  Plus,
  Printer,
  ScanSearch,
  Search,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import useStaffPickupSchedule from "../hooks/useStaffPickupSchedule.js";
import {
  overduePickups as fallbackOverduePickups,
  pickupScheduleTotalScheduled,
  scheduleSections as fallbackScheduleSections,
} from "./pickupScheduleData.js";

const fallbackStatCards = [
  {
    id: "scheduled",
    label: "Total Scheduled",
    value: pickupScheduleTotalScheduled,
    Icon: CalendarDays,
  },
  { id: "completed", label: "Completed", value: 7, Icon: CheckCircle2 },
  { id: "remaining", label: "Remaining", value: 11, Icon: Clock3 },
  { id: "current", label: "Current Slot", value: "Afternoon", Icon: PackageCheck },
];

const quickActions = [
  {
    id: "check-in",
    label: "Check In Customer",
    variant: "primary",
    Icon: ScanSearch,
  },
  {
    id: "manual-entry",
    label: "Manual Pickup Entry",
    variant: "secondary",
    Icon: Search,
  },
  {
    id: "print",
    label: "Print Pickup List",
    variant: "secondary",
    Icon: Printer,
  },
];

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

const mergePickupSections = (liveSections = [], fallbackSections = []) => {
  const sectionMap = new Map();

  [...liveSections, ...fallbackSections].forEach((section) => {
    const existingSection = sectionMap.get(section.id || section.title);

    if (existingSection) {
      existingSection.orders.push(...section.orders);
      return;
    }

    sectionMap.set(section.id || section.title, {
      ...section,
      orders: [...section.orders],
    });
  });

  return Array.from(sectionMap.values());
};

const buildFallbackSchedule = () => ({
  generatedAt: new Date().toISOString(),
  overduePickups: fallbackOverduePickups.map((pickup) => ({
    ...pickup,
    contactEmail: "",
    contactPhone: "",
  })),
  selectedDate: new Date().toISOString(),
  statCards: fallbackStatCards,
  scheduleSections: fallbackScheduleSections,
});

const mergePickupScheduleData = (liveSchedule) => {
  const fallbackSchedule = buildFallbackSchedule();

  return {
    generatedAt: liveSchedule?.generatedAt || fallbackSchedule.generatedAt,
    overduePickups: [
      ...(liveSchedule?.overduePickups || []),
      ...fallbackSchedule.overduePickups,
    ],
    selectedDate: liveSchedule?.selectedDate || fallbackSchedule.selectedDate,
    statCards:
      liveSchedule?.statCards?.length > 0
        ? liveSchedule.statCards.map((card) => ({
            ...card,
            Icon: fallbackStatCards.find((fallbackCard) => fallbackCard.id === card.id)?.Icon,
          }))
        : fallbackSchedule.statCards,
    scheduleSections: mergePickupSections(
      liveSchedule?.scheduleSections || [],
      fallbackSchedule.scheduleSections,
    ),
  };
};

const getContactTarget = (pickup) => {
  const phone = String(pickup.contactPhone || pickup.phone || "").trim();
  const email = String(pickup.contactEmail || "").trim();

  if (phone) {
    return {
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
      label: "Call Customer",
    };
  }

  if (email) {
    return {
      href: `mailto:${email}`,
      label: "Email Customer",
    };
  }

  return {
    href: "",
    label: "Contact Unavailable",
  };
};

const PickupSchedule = () => {
  const [blockTimeSlot, setBlockTimeSlot] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDateValue());
  const dateInputRef = useRef(null);
  const { pickupSchedule, isLoading, error } = useStaffPickupSchedule(selectedDate);
  const resolvedPickupSchedule = useMemo(
    () => mergePickupScheduleData(pickupSchedule),
    [pickupSchedule],
  );

  return (
    <section className="mx-auto w-full max-w-[1500px]">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-[#2c4a7d]">
                Pickup Schedule
              </h1>
              <p className="mt-1 text-[0.8rem] text-slate-500">
                Workflow-synced schedule for {selectedDate}
              </p>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedDate(getTodayDateValue())}
                className="min-w-0 w-full rounded-xl px-2 py-2 text-[0.72rem] font-semibold sm:px-4 sm:text-[0.8rem]"
              >
                Today
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                className="inline-flex min-w-0 w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[0.72rem] font-medium sm:gap-2 sm:px-4 sm:text-[0.8rem]"
              >
                <CalendarDays className="h-4 w-4" />
                <span className="truncate">Date Picker</span>
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="inline-flex min-w-0 w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[0.72rem] font-medium sm:gap-2 sm:px-4 sm:text-[0.8rem]"
              >
                <Cog className="h-4 w-4" />
                <span className="truncate">Manage Time Slots</span>
              </Button>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="rounded-[1rem] bg-white px-4 py-4 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              Loading pickup schedule...
            </div>
          )}

          <section className="rounded-[1.35rem] bg-[#f7dada] p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-[var(--color-primary)]" />
                <h2 className="text-[0.98rem] font-semibold text-[var(--color-primary)]">
                  Past Due Pickups
                </h2>
              </div>
              <p className="text-[0.82rem] font-semibold text-[var(--color-primary)]">
                {resolvedPickupSchedule.overduePickups.length} overdue
              </p>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {resolvedPickupSchedule.overduePickups.map((pickup) => {
                const contactTarget = getContactTarget(pickup);

                return (
                  <article
                    key={`${pickup.id}-${pickup.scheduledDate}`}
                    className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-start gap-2">
                          <h3 className="text-[0.95rem] font-semibold text-slate-900">
                            #{pickup.id}
                          </h3>
                          <span className="text-[0.84rem] text-slate-500">
                            - {pickup.customer}
                          </span>
                        </div>
                        <p className="mt-3 text-[0.78rem] leading-5 text-slate-500">
                          Originally scheduled: {pickup.scheduledDate}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#f7dada] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                            {pickup.overdueText}
                          </span>
                          <span className="text-[0.78rem] text-slate-600">
                            {pickup.items} items
                          </span>
                        </div>
                        {(pickup.contactPhone || pickup.contactEmail) && (
                          <p className="mt-3 text-[0.76rem] text-slate-500">
                            {pickup.contactPhone || pickup.contactEmail}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        disabled={!contactTarget.href}
                        onClick={() => {
                          if (contactTarget.href && typeof window !== "undefined") {
                            window.location.href = contactTarget.href;
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap font-roboto">{contactTarget.label}</span>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {resolvedPickupSchedule.statCards.map((card) => (
              <article
                key={card.id}
                className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
              >
                <div className="flex items-center gap-3">
                  {card.Icon && <card.Icon className="h-4 w-4 text-[var(--color-primary)]" />}
                  <p className="text-[0.82rem] text-slate-500">{card.label}</p>
                </div>
                <p className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 space-y-7">
            {resolvedPickupSchedule.scheduleSections.map((section) => (
              <section key={section.id || section.title}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[1.2rem] font-semibold text-slate-900">
                      {section.title}
                    </h2>
                    <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.78rem] font-semibold text-[var(--color-primary)]">
                      {section.fillText}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${section.statusClassName}`}
                  >
                    {section.statusText}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {section.orders.map((order) => {
                    const contactTarget = getContactTarget(order);

                    return (
                      <article
                        key={`${section.id || section.title}-${order.id}`}
                        className="flex flex-col gap-4 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[0.95rem] font-semibold text-slate-900">
                              #{order.id}
                            </h3>
                            <span className="text-[0.95rem] text-slate-700">
                              {order.customer}
                            </span>
                            <span className="text-[0.76rem] text-slate-500">
                              {order.contactPhone || order.phone || order.contactEmail || ""}
                            </span>
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${order.itemBadgeClassName}`}
                            >
                              {order.items} items
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${order.statusBadgeClassName}`}
                            >
                              {order.status}
                            </span>
                            <span className="text-[0.76rem] text-slate-600">
                              {order.scheduleText}
                            </span>
                            {order.readyText && (
                              <span className="text-[0.76rem] text-slate-600">
                                {order.readyText}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            disabled={!contactTarget.href}
                            onClick={() => {
                              if (contactTarget.href && typeof window !== "undefined") {
                                window.location.href = contactTarget.href;
                              }
                            }}
                            className="text-[0.78rem] font-medium text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {contactTarget.label}
                          </button>
                          <Button
                            variant="primary"
                            size="md"
                            className={`rounded-xl px-4 py-2 text-[0.78rem] font-semibold ${order.buttonClassName || ""}`}
                          >
                            Mark Picked Up
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="space-y-5 self-start">
          <section className="rounded-[1.2rem] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              Capacity Management
            </h2>

            <div className="mt-6">
              <h3 className="text-[1rem] font-semibold text-slate-900">
                Adjust Capacity
              </h3>

              <div className="mt-4 space-y-3">
                {[
                  { label: "Morning", value: 8 },
                  { label: "Afternoon", value: 10 },
                  { label: "Evening", value: 6 },
                ].map((slot) => (
                  <div key={slot.label} className="flex items-center justify-between gap-4">
                    <span className="text-[0.85rem] text-slate-600">{slot.label}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={slot.value}
                        readOnly
                        className="h-10 w-16 rounded-xl border border-slate-200 text-center text-[0.9rem] text-slate-700 outline-none"
                      />
                      <span className="text-[0.85rem] text-slate-600">slots</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[1rem] font-semibold text-slate-900">
                  Block Time Slot
                </h3>
                <button
                  type="button"
                  aria-pressed={blockTimeSlot}
                  onClick={() => setBlockTimeSlot((value) => !value)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    blockTimeSlot
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-primary-soft)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
                      blockTimeSlot ? "translate-x-[1.35rem]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-3 text-[0.8rem] leading-6 text-slate-500">
                Temporarily block new pickups for selected time slots
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-[1rem] font-semibold text-slate-900">
                Special Hours
              </h3>
              <Button
                variant="secondary"
                size="md"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Configure Special Hours</span>
              </Button>
            </div>
          </section>

          <section className="rounded-[1.2rem] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="md"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-medium ${
                    action.variant === "secondary"
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                      : ""
                  }`}
                >
                  <action.Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
};

export default PickupSchedule;
