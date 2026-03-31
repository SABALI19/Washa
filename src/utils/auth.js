const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const AUTH_STORAGE_KEY = "washa.auth";

export const accountRoleLabelMap = {
  Customer: "customer",
  Staff: "staff",
  Admin: "admin",
};

export const customerTypeLabelMap = {
  "Personal Customer": "personal",
  "Business Customer": "business",
};

export const getDashboardPathForRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "staff":
      return "/staff/dashboard";
    case "customer":
    default:
      return "/dashboard/customer";
  }
};

export const saveAuthSession = (session) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const getAuthSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};
