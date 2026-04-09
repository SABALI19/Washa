import { useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest("/admin/dashboard");

        if (!isMounted) {
          return;
        }

        setDashboard(data.dashboard || null);
        setError("");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setDashboard(null);
        setError(requestError.message || "Unable to load the admin dashboard.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return { dashboard, error, isLoading };
};

export default useAdminDashboard;
