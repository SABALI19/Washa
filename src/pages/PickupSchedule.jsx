import Button from "../components/Button";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cog,
  Mail,
  MessageSquare,
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

const fallbackCapacitySlots = [
  { id: "morning", label: "Morning", capacity: 8 },
  { id: "afternoon", label: "Afternoon", capacity: 10 },
  { id: "evening", label: "Evening", capacity: 6 },
];

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

const pickFirstNumber = (...values) => {
  for (const value of values) {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue) && parsedValue >= 0) return parsedValue;
  }
  return null;
};

const parseCapacityFromText = (value) => {
  const match = String(value || "").match(/(\d+)\s*(?:of|\/)\s*(\d+)/i);
  if (!match) return { capacity: null, filled: null };
  return { filled: Number(match[1]), capacity: Number(match[2]) };
};

const getSlotLabel = (value, index) => {
  const normalizedLabel = String(value || "")
    .replace(/\s*slot\s*\(.*/i, "")
    .replace(/\s*\(.*/i, "")
    .trim();
  return normalizedLabel || `Slot ${index + 1}`;
};

const fallbackCapacityMap = new Map(
  fallbackCapacitySlots.map((slot) => [slot.label.toLowerCase(), slot.capacity]),
);

const normalizeCapacitySlot = (slot, index) => {
  const label = getSlotLabel(slot.label || slot.name || slot.slotLabel || slot.title, index);
  const parsedCapacity = parseCapacityFromText(slot.fillText || slot.utilizationText);
  const filled = pickFirstNumber(
    slot.filledSlots, slot.filled, slot.scheduledCount, slot.usedSlots,
    slot.orders?.length, parsedCapacity.filled, 0,
  );
  const capacity = pickFirstNumber(
    slot.capacity, slot.totalSlots, slot.slotCapacity, slot.maxCapacity,
    parsedCapacity.capacity, fallbackCapacityMap.get(label.toLowerCase()), filled, 0,
  );
  const available = Math.max(
    pickFirstNumber(slot.availableSlots, slot.openSlots, slot.remainingSlots, capacity - filled, 0),
    0,
  );
  const isBlocked = Boolean(
    slot.isBlocked || slot.blocked ||
    /blocked/i.test(String(slot.statusText || slot.status || slot.blockedText || "")),
  );
  const isCurrent = Boolean(
    slot.isCurrent || /current/i.test(String(slot.statusText || slot.status || "")),
  );

  let statusLabel = `${available} slots open`;
  if (isBlocked) statusLabel = "Blocked";
  else if (isCurrent) statusLabel = "Current slot";
  else if (capacity > 0 && filled >= capacity) statusLabel = "Full";
  else if (available === 1) statusLabel = "1 slot open";

  return {
    id: slot.id || slot.key || label.toLowerCase().replace(/\s+/g, "-"),
    label, filled, capacity, available,
    utilization: capacity > 0 ? Math.min(Math.round((filled / capacity) * 100), 100) : 0,
    statusLabel, isBlocked, isCurrent,
    blockReason: String(slot.blockReason || slot.blockText || slot.blockedText || "").trim(),
  };
};

const mergePickupSections = (liveSections = [], fallbackSections = []) => {
  const sectionMap = new Map();
  [...liveSections, ...fallbackSections].forEach((section) => {
    const existingSection = sectionMap.get(section.id || section.title);
    if (existingSection) {
      existingSection.orders.push(...section.orders);
      return;
    }
    sectionMap.set(section.id || section.title, { ...section, orders: [...section.orders] });
  });
  return Array.from(sectionMap.values());
};

const buildFallbackSchedule = () => ({
  generatedAt: new Date().toISOString(),
  overduePickups: fallbackOverduePickups.map((pickup) => ({
    ...pickup, contactEmail: "", contactPhone: "",
  })),
  selectedDate: new Date().toISOString(),
  statCards: fallbackStatCards,
  scheduleSections: fallbackScheduleSections,
  capacityManagement: { slots: fallbackCapacitySlots, specialHoursLabel: "" },
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
            Icon: fallbackStatCards.find((fb) => fb.id === card.id)?.Icon,
          }))
        : fallbackSchedule.statCards,
    scheduleSections: mergePickupSections(
      liveSchedule?.scheduleSections || [],
      fallbackSchedule.scheduleSections,
    ),
    capacityManagement: liveSchedule?.capacityManagement || fallbackSchedule.capacityManagement,
  };
};

const getContactPhone = (pickup) =>
  String(pickup.contactPhone || pickup.phone || pickup.customerPhone || "").trim();

const getContactEmail = (pickup) =>
  String(pickup.contactEmail || pickup.email || pickup.customerEmail || "").trim();

const getDialablePhone = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  const digitsOnly = rawValue.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return rawValue.startsWith("+") ? `+${digitsOnly}` : digitsOnly;
};

const getContactSummary = (pickup) =>
  [getContactPhone(pickup), getContactEmail(pickup)].filter(Boolean).join(" | ");

const getCustomerContactActions = (pickup) => {
  const phone = getDialablePhone(getContactPhone(pickup));
  const email = getContactEmail(pickup);
  const actions = [];
  if (phone) {
    actions.push({ id: "call", href: `tel:${phone}`, label: "Call", Icon: Phone });
    actions.push({ id: "text", href: `sms:${phone}`, label: "Text", Icon: MessageSquare });
  }
  if (email) {
    actions.push({ id: "email", href: `mailto:${email}`, label: "Email", Icon: Mail });
  }
  return actions;
};

const launchContactAction = (href) => {
  if (href && typeof window !== "undefined") window.location.href = href;
};

const buildCapacitySummary = (pickupSchedule, resolvedPickupSchedule) => {
  const rawSlots = Array.isArray(pickupSchedule?.capacityManagement?.slots)
    ? pickupSchedule.capacityManagement.slots
    : resolvedPickupSchedule.scheduleSections;
  const slots = rawSlots.map(normalizeCapacitySlot);
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const totalFilled = slots.reduce((sum, slot) => sum + slot.filled, 0);
  const totalAvailable = slots.reduce((sum, slot) => sum + slot.available, 0);
  const blockedSlots = slots.filter((slot) => slot.isBlocked);
  const currentSlot = slots.find((slot) => slot.isCurrent);
  const specialHours = pickupSchedule?.capacityManagement?.specialHours;
  const specialHoursLabel = String(
    pickupSchedule?.capacityManagement?.specialHoursLabel ||
    pickupSchedule?.capacityManagement?.specialHoursText || "",
  ).trim();

  return {
    slots, totalCapacity, totalFilled, totalAvailable, blockedSlots,
    currentSlotLabel: currentSlot?.label || "No active slot",
    utilization: totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0,
    blockSummary:
      String(
        pickupSchedule?.capacityManagement?.blockSummary ||
        pickupSchedule?.capacityManagement?.blockText || "",
      ).trim() ||
      (blockedSlots.length > 0
        ? `${blockedSlots.length} pickup window${blockedSlots.length > 1 ? "s are" : " is"} currently blocked in the workflow.`
        : "All pickup windows are currently open to new bookings."),
    specialHoursText:
      specialHoursLabel ||
      (Array.isArray(specialHours) && specialHours.length > 0
        ? specialHours
            .map((entry) => String(entry.label || entry.text || entry.name || "").trim())
            .filter(Boolean)
            .join(", ")
        : "No special-hour overrides are scheduled for this date."),
    syncedAt: pickupSchedule?.capacityManagement?.updatedAt || resolvedPickupSchedule.generatedAt,
  };
};

const OverdueCarousel = ({ pickups }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el || pickups.length === 0) return 0;
    return el.firstElementChild?.getBoundingClientRect().width || 0;
  };

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.min(Math.max(index, 0), pickups.length - 1);
    const targetCard = el.children[clamped];
    targetCard?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || pickups.length === 0) return;
    const cards = Array.from(el.children);
    const closestIndex = cards.reduce((closest, card, index) => {
      const closestDistance = Math.abs(cards[closest].offsetLeft - el.scrollLeft);
      const cardDistance = Math.abs(card.offsetLeft - el.scrollLeft);
      return cardDistance < closestDistance ? index : closest;
    }, 0);
    setActiveIndex(closestIndex);
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = scrollRef.current?.scrollLeft ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollStart.current + delta;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = startX.current - e.clientX;
    const threshold = getCardWidth() * 0.2;
    if (Math.abs(delta) > threshold) {
      scrollToIndex(activeIndex + (delta > 0 ? 1 : -1));
    } else {
      scrollToIndex(activeIndex);
    }
  };

  return (
    <>
      {/* Mobile (<640px): swipeable snap carousel - ONE CARD AT A TIME */}
<div className="mt-4 sm:hidden min-w-0 overflow-hidden">
  <div
    ref={scrollRef}
    onScroll={handleScroll}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerUp}
    className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 cursor-grab active:cursor-grabbing select-none [touch-action:pan-x] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {pickups.map((pickup) => {
      const customerContactActions = getCustomerContactActions(pickup);
      const contactSummary = getContactSummary(pickup);
      return (
        <article
          key={`${pickup.id}-${pickup.scheduledDate}`}
          className="min-w-full shrink-0 snap-center rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="text-[0.95rem] font-semibold text-slate-900">#{pickup.id}</h3>
            <span className="text-[0.84rem] text-slate-500">- {pickup.customer}</span>
          </div>
          <p className="mt-3 text-[0.78rem] leading-5 text-slate-500">
            Originally scheduled: {pickup.scheduledDate}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f7dada] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
              {pickup.overdueText}
            </span>
            <span className="text-[0.78rem] text-slate-600">{pickup.items} items</span>
          </div>
          {contactSummary && (
            <p className="mt-3 text-[0.76rem] text-slate-500">{contactSummary}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {customerContactActions.length > 0 ? (
              customerContactActions.map((action, index) => (
                <Button
                  key={`${pickup.id}-${action.id}`}
                  variant={index === 0 ? "primary" : "secondary"}
                  size="md"
                  onClick={() => launchContactAction(action.href)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                >
                  <action.Icon className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap font-roboto">{action.label}</span>
                </Button>
              ))
            ) : (
              <span className="text-[0.78rem] font-medium text-slate-400">
                Contact unavailable
              </span>
            )}
          </div>
        </article>
      );
    })}
  </div>

  {/* Clickable dot indicators */}
  {pickups.length > 1 && (
    <div className="mt-3 flex justify-center gap-1.5">
      {pickups.map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to pickup ${index + 1}`}
          onClick={() => scrollToIndex(index)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? "w-5 bg-[var(--color-primary)]"
              : "w-1.5 bg-slate-300 hover:bg-slate-400"
          }`}
        />
      ))}
    </div>
  )}
</div>

      {/* Tablet (640–1023px): single-column stacked rows */}
      <div className="mt-4 hidden flex-col gap-3 sm:flex lg:hidden">
        {pickups.map((pickup) => {
          const customerContactActions = getCustomerContactActions(pickup);
          const contactSummary = getContactSummary(pickup);
          return (
            <article
              key={`${pickup.id}-${pickup.scheduledDate}`}
              className="flex flex-row items-start justify-between gap-4 rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="text-[0.95rem] font-semibold text-slate-900">#{pickup.id}</h3>
                  <span className="text-[0.84rem] text-slate-500">- {pickup.customer}</span>
                </div>
                <p className="mt-2 text-[0.78rem] leading-5 text-slate-500">
                  Originally scheduled: {pickup.scheduledDate}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f7dada] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                    {pickup.overdueText}
                  </span>
                  <span className="text-[0.78rem] text-slate-600">{pickup.items} items</span>
                </div>
                {contactSummary && (
                  <p className="mt-2 text-[0.76rem] text-slate-500">{contactSummary}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {customerContactActions.length > 0 ? (
                  customerContactActions.map((action, index) => (
                    <Button
                      key={`${pickup.id}-${action.id}`}
                      variant={index === 0 ? "primary" : "secondary"}
                      size="md"
                      onClick={() => launchContactAction(action.href)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                    >
                      <action.Icon className="h-3.5 w-3.5" />
                      <span className="whitespace-nowrap font-roboto">{action.label}</span>
                    </Button>
                  ))
                ) : (
                  <span className="text-[0.78rem] font-medium text-slate-400">
                    Contact unavailable
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop (≥1024px): 2-column grid */}
      <div className="mt-4 hidden gap-3 lg:grid lg:grid-cols-2">
        {pickups.map((pickup) => {
          const customerContactActions = getCustomerContactActions(pickup);
          const contactSummary = getContactSummary(pickup);
          return (
            <article
              key={`${pickup.id}-${pickup.scheduledDate}`}
              className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="text-[0.95rem] font-semibold text-slate-900">#{pickup.id}</h3>
                    <span className="text-[0.84rem] text-slate-500">- {pickup.customer}</span>
                  </div>
                  <p className="mt-3 text-[0.78rem] leading-5 text-slate-500">
                    Originally scheduled: {pickup.scheduledDate}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f7dada] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                      {pickup.overdueText}
                    </span>
                    <span className="text-[0.78rem] text-slate-600">{pickup.items} items</span>
                  </div>
                  {contactSummary && (
                    <p className="mt-3 text-[0.76rem] text-slate-500">{contactSummary}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                  {customerContactActions.length > 0 ? (
                    customerContactActions.map((action, index) => (
                      <Button
                        key={`${pickup.id}-${action.id}`}
                        variant={index === 0 ? "primary" : "secondary"}
                        size="md"
                        onClick={() => launchContactAction(action.href)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.78rem] font-semibold"
                      >
                        <action.Icon className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap font-roboto">{action.label}</span>
                      </Button>
                    ))
                  ) : (
                    <span className="text-[0.78rem] font-medium text-slate-400">
                      Contact unavailable
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

const PickupSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateValue());
  const dateInputRef = useRef(null);
  const { pickupSchedule, isLoading, error } = useStaffPickupSchedule(selectedDate);
  const resolvedPickupSchedule = useMemo(
    () => mergePickupScheduleData(pickupSchedule),
    [pickupSchedule],
  );
  const capacitySummary = useMemo(
    () => buildCapacitySummary(pickupSchedule, resolvedPickupSchedule),
    [pickupSchedule, resolvedPickupSchedule],
  );

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1500px] px-4 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8 xl:items-start">
        <div className="min-w-0 space-y-5 sm:space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#2c4a7d] sm:text-[1.6rem]">
                Pickup Schedule
              </h1>
              <p className="mt-1 text-[0.76rem] text-slate-500 sm:text-[0.8rem]">
                Workflow-synced schedule for {selectedDate}
              </p>
            </div>
            {/* Wrapping filter controls on mobile, inline row on larger screens */}
            <div className="flex flex-wrap gap-2 sm:items-center">
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedDate(getTodayDateValue())}
                className="min-w-[96px] flex-1 rounded-xl px-2.5 py-2 text-[0.72rem] font-semibold sm:w-auto sm:flex-none sm:px-4 sm:text-[0.8rem]"
              >
                Today
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                className="inline-flex min-w-[96px] flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[0.72rem] font-medium sm:w-auto sm:flex-none sm:gap-2 sm:px-4 sm:text-[0.8rem]"
              >
                <CalendarDays className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="truncate">Date Picker</span>
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[0.72rem] font-medium sm:w-auto sm:flex-none sm:gap-2 sm:px-4 sm:text-[0.8rem]"
              >
                <Cog className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
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

          {/* Overdue Pickups */}
          <section className="rounded-[1.35rem] bg-[#f7dada] p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                <h2 className="text-[0.92rem] font-semibold text-[var(--color-primary)] sm:text-[0.98rem]">
                  Past Due Pickups
                </h2>
              </div>
              <p className="shrink-0 text-[0.8rem] font-semibold text-[var(--color-primary)] sm:text-[0.82rem]">
                {resolvedPickupSchedule.overduePickups.length} overdue
              </p>
            </div>
            <OverdueCarousel pickups={resolvedPickupSchedule.overduePickups} />
          </section>

          {/* Stat Cards - stacked on mobile, flexed on large screens */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:flex lg:flex-wrap">
            {resolvedPickupSchedule.statCards.map((card) => (
              <article
                key={card.id}
                className="rounded-[1rem] bg-white p-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-4 lg:min-w-0 lg:flex-1 lg:basis-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {card.Icon && (
                    <card.Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)] sm:h-4 sm:w-4" />
                  )}
                  <p className="text-[0.74rem] text-slate-500 sm:text-[0.82rem]">{card.label}</p>
                </div>
                <p className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--color-primary)] sm:mt-3 sm:text-[1.7rem]">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          {/* Schedule Sections */}
          <div className="space-y-6 sm:space-y-7">
            {resolvedPickupSchedule.scheduleSections.map((section) => (
              <section key={section.id || section.title}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h2 className="text-[1rem] font-semibold text-slate-900 sm:text-[1.2rem]">
                      {section.title}
                    </h2>
                    <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.74rem] font-semibold text-[var(--color-primary)] sm:text-[0.78rem]">
                      {section.fillText}
                    </span>
                  </div>
                  <span className={`self-start rounded-full px-3 py-1 text-[0.7rem] font-semibold sm:self-auto sm:text-[0.72rem] ${section.statusClassName}`}>
                    {section.statusText}
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  {section.orders.map((order) => {
                    const customerContactActions = getCustomerContactActions(order);
                    const contactSummary = getContactSummary(order);
                    return (
                      <article
                        key={`${section.id || section.title}-${order.id}`}
                        className="flex flex-col gap-3 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:gap-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h3 className="text-[0.88rem] font-semibold text-slate-900 sm:text-[0.95rem]">
                              #{order.id}
                            </h3>
                            <span className="text-[0.88rem] text-slate-700 sm:text-[0.95rem]">
                              {order.customer}
                            </span>
                            {contactSummary && (
                              <span className="text-[0.72rem] text-slate-500 sm:text-[0.76rem]">
                                {contactSummary}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold sm:text-[0.72rem] ${order.itemBadgeClassName}`}>
                              {order.items} items
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold sm:text-[0.72rem] ${order.statusBadgeClassName}`}>
                              {order.status}
                            </span>
                            <span className="text-[0.72rem] text-slate-600 sm:text-[0.76rem]">
                              {order.scheduleText}
                            </span>
                            {order.readyText && (
                              <span className="text-[0.72rem] text-slate-600 sm:text-[0.76rem]">
                                {order.readyText}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                          <div className="flex flex-wrap gap-2">
                            {customerContactActions.length > 0 ? (
                              customerContactActions.map((action, index) => (
                                <button
                                  key={`${order.id}-${action.id}`}
                                  type="button"
                                  onClick={() => launchContactAction(action.href)}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-medium sm:text-[0.76rem] ${
                                    index === 0
                                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  <action.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  <span>{action.label}</span>
                                </button>
                              ))
                            ) : (
                              <span className="text-[0.76rem] text-slate-400">No contact method</span>
                            )}
                          </div>
                          <Button
                            variant="primary"
                            size="md"
                            className={`w-full rounded-xl px-4 py-2 text-[0.76rem] font-semibold sm:w-auto sm:text-[0.78rem] ${order.buttonClassName || ""}`}
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

        {/* Sidebar — full width below xl, sticky fixed column on xl+ */}
        <aside className="space-y-4 sm:space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-[1.2rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[1.05rem] font-semibold text-slate-900 sm:text-[1.2rem]">
                  Capacity Management
                </h2>
                <p className="mt-1 text-[0.72rem] text-slate-500 sm:text-[0.76rem]">
                  Synced with the live pickup workflow
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                {capacitySummary.utilization}% used
              </span>
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">
                Adjust Capacity
              </h3>
              {/* Slots: horizontal scroll on mobile, stacked on sm+ */}
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 sm:mt-4 sm:block sm:overflow-visible sm:pb-0 sm:space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {capacitySummary.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="min-w-[180px] shrink-0 rounded-[1rem] border border-slate-100 p-3 sm:min-w-0 sm:shrink-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.85rem] font-semibold text-slate-900 sm:text-[0.9rem]">
                          {slot.label}
                        </p>
                        <p className="mt-1 text-[0.7rem] text-slate-500 sm:text-[0.76rem]">
                          {slot.statusLabel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[0.85rem] font-semibold text-[var(--color-primary)] sm:text-[0.92rem]">
                          {slot.filled}/{slot.capacity}
                        </p>
                        <p className="text-[0.68rem] text-slate-500 sm:text-[0.72rem]">scheduled</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[var(--color-primary-soft)]">
                      <div
                        className={`h-2 rounded-full ${slot.isBlocked ? "bg-slate-400" : "bg-[var(--color-primary)]"}`}
                        style={{ width: `${slot.utilization}%` }}
                      />
                    </div>
                    {slot.blockReason && (
                      <p className="mt-2 text-[0.7rem] text-slate-500">{slot.blockReason}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                {[
                  { label: "Scheduled", value: capacitySummary.totalFilled },
                  { label: "Open", value: capacitySummary.totalAvailable },
                  { label: "Current", value: capacitySummary.currentSlotLabel },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] bg-slate-50 px-2 py-2.5 text-center sm:px-3 sm:py-3">
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.08em] text-slate-500 sm:text-[0.7rem]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[0.82rem] font-semibold text-slate-900 sm:text-[0.92rem]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">
                  Block Time Slot
                </h3>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                    capacitySummary.blockedSlots.length > 0
                      ? "bg-[#f7dada] text-[var(--color-primary)]"
                      : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  }`}
                >
                  {capacitySummary.blockedSlots.length > 0
                    ? `${capacitySummary.blockedSlots.length} blocked`
                    : "Open"}
                </span>
              </div>
              <p className="mt-3 text-[0.76rem] leading-6 text-slate-500 sm:text-[0.8rem]">
                {capacitySummary.blockSummary}
              </p>
              {capacitySummary.blockedSlots.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {capacitySummary.blockedSlots.map((slot) => (
                    <span
                      key={`blocked-${slot.id}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-[0.72rem] font-medium text-slate-600"
                    >
                      {slot.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">
                Special Hours
              </h3>
              <div className="mt-3 rounded-[1rem] bg-slate-50 px-4 py-4 sm:mt-4">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="text-[0.74rem] font-semibold sm:text-[0.78rem]">
                    Workflow Overrides
                  </span>
                </div>
                <p className="mt-2 text-[0.76rem] leading-6 text-slate-500 sm:text-[0.8rem]">
                  {capacitySummary.specialHoursText}
                </p>
              </div>
              <p className="mt-3 text-[0.7rem] text-slate-400 sm:text-[0.72rem]">
                Last synced: {capacitySummary.syncedAt || "Unavailable"}
              </p>
            </div>
          </section>

          <section className="rounded-[1.2rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-5">
            <h2 className="text-[1.05rem] font-semibold text-slate-900 sm:text-[1.2rem]">
              Quick Actions
            </h2>
            {/* 3-col grid on mobile, stacked column on sm+ */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:grid-cols-1 sm:gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="md"
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[0.66rem] font-medium sm:gap-2 sm:px-4 sm:text-[0.8rem] ${
                    action.variant === "secondary"
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                      : ""
                  }`}
                >
                  <action.Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  <span className="truncate">{action.label}</span>
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
