import { useState } from "react";
import { Plus, RefreshCw, UserPlus, UsersRound } from "lucide-react";

import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";
import useAdminStaffManagement from "../../hooks/useAdminStaffManagement.js";

const summaryCards = [
  { key: "totalStaff", label: "Total Staff" },
  { key: "onDutyCount", label: "On Duty" },
  { key: "offDutyCount", label: "Off Duty" },
];

const AdminStaffManagement = () => {
  const {
    createStaffMember,
    error,
    isCreating,
    isLoading,
    refreshStaffManagement,
    staffManagement,
  } = useAdminStaffManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const rows = staffManagement?.rows || [];
  const summary = staffManagement?.summary || {};

  const updateFormValue = (key, value) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormValues({
      email: "",
      name: "",
      password: "",
      phone: "",
    });
  };

  const handleCreateStaff = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    if (
      !formValues.name.trim() ||
      !formValues.email.trim() ||
      !formValues.phone.trim() ||
      !formValues.password
    ) {
      setFormError("Enter the staff member's name, email, phone, and temporary password.");
      return;
    }

    if (formValues.password.length < 8) {
      setFormError("Temporary password must be at least 8 characters long.");
      return;
    }

    try {
      await createStaffMember({
        email: formValues.email.trim(),
        name: formValues.name.trim(),
        password: formValues.password,
        phone: formValues.phone.trim(),
      });
      resetForm();
      setShowCreateForm(false);
      setFormMessage("Staff account created. They can now sign in from the Staff tab.");
    } catch (requestError) {
      setFormError(requestError.message || "Unable to create staff account.");
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[1.25rem] font-inter font-semibold tracking-normal text-[#2c4a7d] sm:text-[1.45rem] lg:text-[1.65rem] xl:text-[1.95rem]">
              Staff Management
            </h1>
            <p className="mt-1.5 text-[0.72rem] text-gray-500">
              Live attendance and staff duty status
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowCreateForm((value) => !value)}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.68rem] font-medium sm:px-4 sm:text-[0.75rem]"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{showCreateForm ? "Close Form" : "Create Staff"}</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => refreshStaffManagement()}
              disabled={isLoading}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.68rem] font-medium sm:px-4 sm:text-[0.75rem]"
            >
              <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${isLoading ? "animate-spin" : ""}`} />
              <span className="truncate">{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            Loading staff management...
          </div>
        )}

        {(showCreateForm || formMessage || formError) && (
          <Card className="mt-4 rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[var(--color-primary)]" />
              <h2 className="text-[1rem] font-semibold text-slate-900">
                Create Staff Account
              </h2>
            </div>

            {formMessage && (
              <div className="mt-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-[0.82rem] text-emerald-700">
                {formMessage}
              </div>
            )}

            {formError && (
              <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
                {formError}
              </div>
            )}

            {showCreateForm && (
              <form className="mt-4 grid gap-3 lg:grid-cols-2" onSubmit={handleCreateStaff}>
                <label className="block">
                  <span className="text-[0.72rem] font-medium text-slate-600">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(event) => updateFormValue("name", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-[0.82rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    placeholder="Staff full name"
                  />
                </label>

                <label className="block">
                  <span className="text-[0.72rem] font-medium text-slate-600">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) => updateFormValue("email", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-[0.82rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    placeholder="staff@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-[0.72rem] font-medium text-slate-600">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(event) => updateFormValue("phone", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-[0.82rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    placeholder="Staff phone number"
                  />
                </label>

                <label className="block">
                  <span className="text-[0.72rem] font-medium text-slate-600">
                    Temporary Password
                  </span>
                  <input
                    type="text"
                    value={formValues.password}
                    onChange={(event) => updateFormValue("password", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-[0.82rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    placeholder="At least 8 characters"
                  />
                </label>

                <div className="flex flex-col gap-2 pt-1 sm:flex-row lg:col-span-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isCreating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-[0.76rem] font-semibold"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{isCreating ? "Creating..." : "Create Staff Account"}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      resetForm();
                      setFormError("");
                      setShowCreateForm(false);
                    }}
                    disabled={isCreating}
                    className="rounded-xl px-4 py-2 text-[0.76rem] font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3">
          {summaryCards.map((item) => (
            <Card
              key={item.key}
              className="rounded-[1rem] border-slate-100 p-3 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)] sm:p-4"
            >
              <p className="text-[0.68rem] text-slate-500 sm:text-[0.76rem]">{item.label}</p>
              <p className="mt-2 text-[1.35rem] font-semibold leading-none text-slate-900 sm:text-[1.8rem]">
                {summary[item.key] ?? 0}
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-4 rounded-[1.2rem] border-slate-100 p-0 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
            <UsersRound className="h-4 w-4 text-[var(--color-primary)]" />
            <h2 className="text-[1rem] font-semibold text-slate-900">Staff Roster</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((staff) => (
              <div
                key={staff.id}
                className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.9rem] font-semibold text-slate-900">
                    {staff.name}
                  </p>
                  <p className="mt-1 truncate text-[0.72rem] text-slate-500">{staff.email}</p>
                </div>

                <div className="min-w-0">
                  <p className="text-[0.7rem] text-slate-500">Clocked In</p>
                  <p className="mt-1 truncate text-[0.78rem] text-slate-700">
                    {staff.clockedInAtLabel}
                  </p>
                </div>

                <div className="flex items-center md:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                      staff.isOnDuty
                        ? "bg-[#ecfdf5] text-[#047857]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="px-4 py-6 text-[0.82rem] text-slate-500">
                No staff accounts found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminStaffManagement;
