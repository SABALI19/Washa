const Quickfilter = ({ filters = [] }) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Quick Filters
      </h2>

      <div className="mt-4 space-y-2.5">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-[0.82rem] font-medium text-slate-500 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Quickfilter;
