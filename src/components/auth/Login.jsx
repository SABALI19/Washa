import {
  Apple,
  CalendarDays,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";
import { useState } from "react";

import laundry3Image from "../../assets/images/laundry3.jpg";
import laundry8Image from "../../assets/images/laundry8.jpg";
import logoBlue from "../../assets/logo/washa-logo-blue.png";

const accountRoles = ["Customer", "Staff", "Admin"];

const experiencePoints = [
  { label: "Visual Accountability", Icon: Camera },
  { label: "Real-Time Tracking", Icon: CheckCircle2 },
  { label: "Flexible Pickup", Icon: CalendarDays },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(accountRoles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="hidden px-8 py-6 lg:block">
          <div className="flex items-center gap-2">
            <img src={logoBlue} alt="LaundryTrack" className="h-6 w-6 object-contain" />
            <span className="text-base font-medium text-slate-800">LaundryTrack</span>
          </div>

          <div className="mt-10 max-w-[430px]">
            <div className="overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.14)]">
              <img
                src={laundry3Image}
                alt="LaundryTrack mobile experience"
                className="h-[180px] w-full object-cover"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-[1.35rem] font-medium text-slate-900">
                Experience Complete Peace of Mind
              </h2>

              <div className="mt-4 space-y-3">
                {experiencePoints.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.Icon className="h-4 w-4 text-[var(--color-primary)]" />
                    <span className="text-[0.92rem] text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <p className="text-[0.78rem] leading-6 text-slate-500">
                  "Finally, a laundry service I can trust completely. Seeing photos
                  of my items at every step gives me total confidence."
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={laundry8Image}
                    alt="Sarah Chen"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[0.8rem] font-semibold text-slate-900">
                      Sarah Chen
                    </p>
                    <p className="text-[0.72rem] text-slate-500">Regular Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-col justify-between py-4">
          <div>
            <div className="text-center">
              <h1 className="text-[1.55rem] font-semibold text-slate-900">
                Sign In to LaundryTrack
              </h1>
              <p className="mt-2 text-[0.82rem] text-slate-500">
                Access your laundry tracking dashboard
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-1">
              {accountRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-lg px-3 py-2 text-[0.72rem] font-medium transition-colors ${
                    selectedRole === role
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4">
              <LoginField
                label="Email Address"
                placeholder="Enter your email address"
                Icon={Mail}
                type="email"
              />
              <PasswordField
                label="Password"
                placeholder="Enter your password"
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((value) => !value)}
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((value) => !value)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-[0.68rem] text-slate-500">Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-[0.68rem] font-medium text-[var(--color-primary)]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center text-[0.68rem] uppercase tracking-[0.2em] text-slate-300">
              OR
            </div>

            <div className="mt-4 space-y-3">
              <SocialButton label="Continue with Google" icon="google" />
              <SocialButton label="Continue with Apple" icon="apple" />
            </div>

            <p className="mt-5 text-center text-[0.72rem] text-slate-400">
              Don&apos;t have an account?{" "}
              <span className="font-medium text-[var(--color-primary)]">Sign Up</span>
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-5 text-[0.62rem] text-slate-400">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Help</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoginField = ({ label, placeholder, Icon, type = "text" }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-medium text-slate-700">
        {label}
      </span>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <Icon className="h-4 w-4 shrink-0 text-slate-300" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-300"
        />
      </div>
    </label>
  );
};

const PasswordField = ({
  label,
  placeholder,
  visible,
  onToggleVisibility,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-medium text-slate-700">
        {label}
      </span>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <div className="h-4 w-4 shrink-0" />
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-300"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-slate-300 transition-colors hover:text-slate-500"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
};

const SocialButton = ({ label, icon }) => {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[0.78rem] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      {icon === "google" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c6.1 0 9.1-4.3 9.1-6.6 0-.4 0-.7-.1-1H12Z"
          />
          <path
            fill="#34A853"
            d="M2.8 7.7l3.2 2.3C6.9 8 9.2 6.3 12 6.3c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 8.4 2.7 5.3 4.8 3.7 7.9l-.9-.2Z"
          />
          <path
            fill="#FBBC05"
            d="M12 21.3c2.5 0 4.7-.8 6.3-2.4l-3-2.4c-.8.6-1.9 1-3.3 1-3.9 0-5.3-2.6-5.6-3.9l-3.1 2.4c1.6 3.2 4.8 5.3 8.7 5.3Z"
          />
          <path
            fill="#4285F4"
            d="M21.1 13.7c.1-.3.1-.6.1-1 0-.4 0-.7-.1-1H12v3.9h5.5c-.3 1.2-1.3 2.2-2.3 2.9l3 2.4c1.8-1.7 2.9-4.1 2.9-7.2Z"
          />
        </svg>
      ) : (
        <Apple className="h-4 w-4 fill-current text-slate-900" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default Login;
