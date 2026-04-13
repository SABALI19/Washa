import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminAnalytics = ({ range = "week" } = {}) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(
    async ({ shouldUpdate = () => true } = {}) => {
      try {
        setIsLoading(true);

        const query = new URLSearchParams({ range }).toString();
        const data = await apiRequest(`/admin/analytics?${query}`);

        if (!shouldUpdate()) {
          return;
        }

        setAnalytics(data.analytics || null);
        setError("");
      } catch (requestError) {
        if (!shouldUpdate()) {
          return;
        }

        setAnalytics(null);
        setError(requestError.message || "Unable to load admin analytics.");
      } finally {
        if (shouldUpdate()) {
          setIsLoading(false);
        }
      }
    },
    [range],
  );

  useEffect(() => {
    let isMounted = true;

    loadAnalytics({ shouldUpdate: () => isMounted });

    return () => {
      isMounted = false;
    };
  }, [loadAnalytics]);

  return { analytics, error, isLoading, refreshAnalytics: loadAnalytics };
};

export default useAdminAnalytics;
