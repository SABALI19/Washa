import { useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest("/admin/analytics");

        if (!isMounted) {
          return;
        }

        setAnalytics(data.analytics || null);
        setError("");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setAnalytics(null);
        setError(requestError.message || "Unable to load admin analytics.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  return { analytics, error, isLoading };
};

export default useAdminAnalytics;
